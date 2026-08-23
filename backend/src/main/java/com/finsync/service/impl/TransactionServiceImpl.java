package com.finsync.service.impl;

import com.finsync.dto.AmountRequest;
import com.finsync.dto.QrTransferRequest;
import com.finsync.dto.TransferRequest;
import com.finsync.exception.BadRequestException;
import com.finsync.exception.InsufficientBalanceException;
import com.finsync.exception.ResourceNotFoundException;
import com.finsync.model.*;
import com.finsync.repository.*;
import com.finsync.service.AccountService;
import com.finsync.service.AuditLogService;
import com.finsync.service.NotificationService;
import com.finsync.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final AccountService accountService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    private static final BigDecimal LOW_RISK_THRESHOLD = new BigDecimal("50000.00");
    private static final BigDecimal MEDIUM_RISK_THRESHOLD = new BigDecimal("100000.00");

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Map<String, Object> deposit(Long userId, Long accountId, AmountRequest req) {
        if (req == null || req.amount == null || req.amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Deposit amount must be greater than zero");
        }

        checkSystemLimits(req.amount);

        Account account = accountService.getOwnedAccount(accountId, userId);
        if ("FROZEN".equalsIgnoreCase(account.getStatus()) || "BLOCKED".equalsIgnoreCase(account.getStatus())) {
            throw new BadRequestException("Account is currently frozen or inactive. Cannot accept deposits.");
        }

        account.setBalance(account.getBalance().add(req.amount));
        accountRepository.save(account);

        String riskLevel = calculateRiskLevel(req.amount, false);

        Transaction txn = new Transaction();
        txn.setAccount(account);
        txn.setType(TransactionType.DEPOSIT);
        txn.setAmount(req.amount);
        txn.setBalanceAfter(account.getBalance());
        txn.setDescription(req.description != null && !req.description.trim().isEmpty() ? req.description : "Cash / Online Deposit");
        txn.setStatus("SUCCESS");
        txn.setRiskLevel(riskLevel);
        txn = transactionRepository.save(txn);

        User user = account.getUser();
        notificationService.sendNotification(
                user,
                "Deposit Credited",
                "₹" + req.amount + " deposited into your " + account.getAccountType() + " account (" + account.getAccountNumber() + ").",
                "DEPOSIT"
        );

        auditLogService.logAction(
                user,
                account.getAccountNumber(),
                "DEPOSIT",
                "Deposit of ₹" + req.amount + " - " + txn.getDescription(),
                req.amount,
                "SUCCESS",
                riskLevel
        );

        return toMap(txn);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Map<String, Object> withdraw(Long userId, Long accountId, AmountRequest req) {
        if (req == null || req.amount == null || req.amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Withdrawal amount must be greater than zero");
        }

        checkSystemLimits(req.amount);

        Account account = accountService.getOwnedAccount(accountId, userId);
        if ("FROZEN".equalsIgnoreCase(account.getStatus()) || "BLOCKED".equalsIgnoreCase(account.getStatus())) {
            throw new BadRequestException("Account is currently frozen or inactive. Transactions are disabled.");
        }

        if (account.getDailyLimit() != null && req.amount.compareTo(account.getDailyLimit()) > 0) {
            throw new BadRequestException("Amount exceeds daily transaction limit of ₹" + account.getDailyLimit());
        }

        if (account.getBalance().compareTo(req.amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance for withdrawal. Current balance: ₹" + account.getBalance());
        }

        account.setBalance(account.getBalance().subtract(req.amount));
        accountRepository.save(account);

        String riskLevel = calculateRiskLevel(req.amount, false);

        Transaction txn = new Transaction();
        txn.setAccount(account);
        txn.setType(TransactionType.WITHDRAWAL);
        txn.setAmount(req.amount);
        txn.setBalanceAfter(account.getBalance());
        txn.setDescription(req.description != null && !req.description.trim().isEmpty() ? req.description : "Cash Withdrawal");
        txn.setStatus("SUCCESS");
        txn.setRiskLevel(riskLevel);
        txn = transactionRepository.save(txn);

        User user = account.getUser();
        notificationService.sendNotification(
                user,
                "Cash Withdrawal",
                "₹" + req.amount + " withdrawn from your " + account.getAccountType() + " account (" + account.getAccountNumber() + ").",
                "WITHDRAWAL"
        );

        if ("HIGH".equals(riskLevel)) {
            notificationService.sendNotification(
                    user,
                    "High-Value Withdrawal Alert",
                    "A high-value withdrawal of ₹" + req.amount + " was processed from account " + account.getAccountNumber() + ".",
                    "SECURITY"
            );
        }

        auditLogService.logAction(
                user,
                account.getAccountNumber(),
                "WITHDRAWAL",
                "Withdrawal of ₹" + req.amount + " - " + txn.getDescription(),
                req.amount,
                "SUCCESS",
                riskLevel
        );

        return toMap(txn);
    }

    /**
     * Executes atomic P2P fund transfer across accounts with ACID transactional guarantees.
     */
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Map<String, Object> transfer(Long userId, TransferRequest req) {
        if (req == null) {
            throw new BadRequestException("Transfer request cannot be empty");
        }

        if (req.amount == null || req.amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Transfer amount must be greater than zero");
        }

        checkSystemLimits(req.amount);

        String rawFrom = req.fromAccountNumber != null ? req.fromAccountNumber.trim() : "";
        String rawTo = req.toAccountNumber != null ? req.toAccountNumber.trim() : "";

        if (rawFrom.isEmpty()) {
            throw new BadRequestException("Source account number is required");
        }
        if (rawTo.isEmpty()) {
            throw new BadRequestException("Recipient account number is required");
        }

        // Extract pure account number from strings like "siva (FS4992820634)"
        String cleanTo = rawTo;
        java.util.regex.Matcher toMatcher = java.util.regex.Pattern.compile("(FS\\d+)").matcher(rawTo);
        if (toMatcher.find()) {
            cleanTo = toMatcher.group(1);
        }

        String cleanFrom = rawFrom;
        java.util.regex.Matcher fromMatcher = java.util.regex.Pattern.compile("(FS\\d+)").matcher(rawFrom);
        if (fromMatcher.find()) {
            cleanFrom = fromMatcher.group(1);
        }

        // 1. Locate Source Account
        Account from = accountRepository.findByAccountNumber(cleanFrom).orElse(null);
        if (from == null && !rawFrom.equals(cleanFrom)) {
            from = accountRepository.findByAccountNumber(rawFrom).orElse(null);
        }
        if (from == null) {
            List<Account> userAccounts = accountRepository.findByUserId(userId);
            if (!userAccounts.isEmpty()) {
                from = userAccounts.get(0);
            } else {
                throw new ResourceNotFoundException("Source account not found: " + rawFrom);
            }
        }

        // Security check: Source account must belong to the logged-in user
        if (!from.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized: You do not own the source account");
        }

        // Account & Card Status checks
        if ("FROZEN".equalsIgnoreCase(from.getStatus()) || "BLOCKED".equalsIgnoreCase(from.getStatus())) {
            throw new BadRequestException("Source account is currently frozen or inactive. Transfers are restricted.");
        }

        if (from.getDailyLimit() != null && req.amount.compareTo(from.getDailyLimit()) > 0) {
            throw new BadRequestException("Transfer amount of ₹" + req.amount + " exceeds your daily limit of ₹" + from.getDailyLimit());
        }

        // 2. Locate Recipient Account
        Account to = accountRepository.findByAccountNumber(cleanTo).orElse(null);
        if (to == null && !rawTo.equals(cleanTo)) {
            to = accountRepository.findByAccountNumber(rawTo).orElse(null);
        }

        // If not found by account number, try finding by user name/email/phone
        if (to == null) {
            List<User> allUsers = userRepository.findAll();
            User matchingUser = allUsers.stream()
                    .filter(u -> !u.getId().equals(userId) && (
                            (u.getFullName() != null && u.getFullName().equalsIgnoreCase(rawTo)) ||
                            (u.getEmail() != null && u.getEmail().equalsIgnoreCase(rawTo)) ||
                            (u.getPhoneNumber() != null && u.getPhoneNumber().equals(rawTo)) ||
                            (u.getPublicPaymentId() != null && u.getPublicPaymentId().equalsIgnoreCase(rawTo))
                    ))
                    .findFirst()
                    .orElse(null);

            if (matchingUser != null) {
                List<Account> recipientAccs = accountRepository.findByUserId(matchingUser.getId());
                if (!recipientAccs.isEmpty()) {
                    to = recipientAccs.get(0);
                }
            }

            // If still null, auto-provision recipient account in database for external/mock beneficiary accounts
            if (to == null) {
                User recipientOwner = matchingUser;
                if (recipientOwner == null) {
                    recipientOwner = allUsers.stream()
                            .filter(u -> !u.getId().equals(userId))
                            .findFirst()
                            .orElse(from.getUser());
                }

                to = new Account();
                to.setAccountNumber(!cleanTo.isEmpty() ? cleanTo : (!rawTo.isEmpty() ? rawTo : "FS" + (1000000000L + (long)(Math.random() * 9000000000L))));
                to.setUser(recipientOwner);
                to.setAccountType(AccountType.SAVINGS);
                to.setBalance(BigDecimal.ZERO);
                to.setPrimary(true);
                to.setStatus("ACTIVE");
                to.setDailyLimit(new BigDecimal("50000.00"));
                to = accountRepository.save(to);
            }
        }

        // Validation: Cannot transfer to same account
        if (from.getId().equals(to.getId()) || from.getAccountNumber().equalsIgnoreCase(to.getAccountNumber())) {
            throw new BadRequestException("Cannot transfer money to the same account");
        }

        // Balance Check
        BigDecimal fromBalance = from.getBalance() != null ? from.getBalance() : BigDecimal.ZERO;
        if (fromBalance.compareTo(req.amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance in source account. Current balance: ₹" + fromBalance);
        }

        // Risk Level Calculation
        boolean isNewBeneficiary = isNewPayee(from.getId(), to.getAccountNumber());
        String riskLevel = calculateRiskLevel(req.amount, isNewBeneficiary);

        // State Mutations
        BigDecimal toBalance = to.getBalance() != null ? to.getBalance() : BigDecimal.ZERO;
        from.setBalance(fromBalance.subtract(req.amount));
        to.setBalance(toBalance.add(req.amount));

        accountRepository.save(from);
        accountRepository.save(to);

        // Ledger Records
        Transaction debit = new Transaction();
        debit.setAccount(from);
        debit.setType(TransactionType.TRANSFER_OUT);
        debit.setAmount(req.amount);
        debit.setBalanceAfter(from.getBalance());
        debit.setCounterpartyAccountNumber(to.getAccountNumber());
        debit.setDescription(req.description != null && !req.description.trim().isEmpty() ? req.description : "Fund Transfer to " + to.getAccountNumber());
        debit.setStatus("SUCCESS");
        debit.setRiskLevel(riskLevel);
        transactionRepository.save(debit);

        Transaction credit = new Transaction();
        credit.setAccount(to);
        credit.setType(TransactionType.TRANSFER_IN);
        credit.setAmount(req.amount);
        credit.setBalanceAfter(to.getBalance());
        credit.setCounterpartyAccountNumber(from.getAccountNumber());
        credit.setDescription(req.description != null && !req.description.trim().isEmpty() ? req.description : "Fund Transfer from " + from.getAccountNumber());
        credit.setStatus("SUCCESS");
        credit.setRiskLevel(riskLevel);
        transactionRepository.save(credit);

        // Notifications
        User sender = from.getUser();
        User receiver = to.getUser();

        notificationService.sendNotification(
                sender,
                "Transfer Successful",
                "₹" + req.amount + " sent to " + to.getAccountNumber() + ". Risk Level: " + riskLevel,
                "TRANSFER"
        );

        if (!sender.getId().equals(receiver.getId())) {
            notificationService.sendNotification(
                    receiver,
                    "Transfer Received",
                    "₹" + req.amount + " received from " + from.getAccountNumber() + ".",
                    "TRANSFER"
            );
        }

        if ("HIGH".equals(riskLevel)) {
            notificationService.sendNotification(
                    sender,
                    "High-Risk Transfer Alert",
                    "High-value transfer of ₹" + req.amount + " completed with heightened security logging.",
                    "SECURITY"
            );
        }

        // Audit Trail
        auditLogService.logAction(
                sender,
                from.getAccountNumber(),
                "TRANSFER",
                "Transferred ₹" + req.amount + " to " + to.getAccountNumber() + " (" + debit.getDescription() + ")",
                req.amount,
                "SUCCESS",
                riskLevel
        );

        return Map.of(
            "message", "Transfer completed successfully",
            "amount", req.amount,
            "fromAccount", from.getAccountNumber(),
            "toAccount", to.getAccountNumber(),
            "newBalance", from.getBalance(),
            "status", "SUCCESS",
            "riskLevel", riskLevel,
            "transactionId", debit.getId()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> resolveQrRecipient(Long currentUserId, String payId) {
        if (payId == null || payId.trim().isEmpty()) {
            throw new BadRequestException("Payment ID or QR Code cannot be empty");
        }

        String cleanPayId = payId.trim();
        if (cleanPayId.contains("payId=")) {
            int idx = cleanPayId.indexOf("payId=");
            cleanPayId = cleanPayId.substring(idx + 6);
            if (cleanPayId.contains("&")) {
                cleanPayId = cleanPayId.substring(0, cleanPayId.indexOf("&"));
            }
        }

        User recipient = userRepository.findByPublicPaymentId(cleanPayId).orElse(null);
        if (recipient == null) {
            recipient = userRepository.findByEmail(cleanPayId).orElse(null);
        }

        if (recipient == null) {
            throw new ResourceNotFoundException("Invalid FinSync Pay ID: " + cleanPayId + ". Recipient not found.");
        }

        if (!"ACTIVE".equalsIgnoreCase(recipient.getAccountStatus())) {
            throw new BadRequestException("Recipient account is currently inactive or restricted.");
        }

        if (currentUserId != null && currentUserId.equals(recipient.getId())) {
            throw new BadRequestException("You cannot transfer money to your own account.");
        }

        List<Account> accounts = accountRepository.findByUserId(recipient.getId());
        if (accounts.isEmpty()) {
            throw new BadRequestException("Recipient has no active bank accounts to receive funds.");
        }

        Account primaryAcc = accounts.stream()
                .filter(Account::isPrimary)
                .findFirst()
                .orElse(accounts.get(0));

        String accNo = primaryAcc.getAccountNumber();
        String masked = accNo.length() > 4 ? "****" + accNo.substring(accNo.length() - 4) : accNo;

        Map<String, Object> res = new HashMap<>();
        res.put("recipientName", recipient.getFullName());
        res.put("publicPaymentId", recipient.getPublicPaymentId() != null ? recipient.getPublicPaymentId() : cleanPayId);
        res.put("primaryAccountType", primaryAcc.getAccountType().name());
        res.put("maskedAccountNumber", masked);
        res.put("active", true);
        return res;
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Map<String, Object> processQrTransfer(Long senderUserId, QrTransferRequest req) {
        if (req == null) {
            throw new BadRequestException("QR Transfer request cannot be empty");
        }
        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Transfer amount must be greater than zero");
        }

        checkSystemLimits(req.getAmount());

        String cleanPayId = req.getPayId() != null ? req.getPayId().trim() : "";
        if (cleanPayId.contains("payId=")) {
            int idx = cleanPayId.indexOf("payId=");
            cleanPayId = cleanPayId.substring(idx + 6);
            if (cleanPayId.contains("&")) {
                cleanPayId = cleanPayId.substring(0, cleanPayId.indexOf("&"));
            }
        }

        User recipient = userRepository.findByPublicPaymentId(cleanPayId).orElse(null);
        if (recipient == null) {
            recipient = userRepository.findByEmail(cleanPayId).orElse(null);
        }

        if (recipient == null) {
            throw new ResourceNotFoundException("Invalid FinSync Pay ID: " + cleanPayId + ". Recipient not found.");
        }

        if (senderUserId.equals(recipient.getId())) {
            throw new BadRequestException("You cannot transfer money to your own account.");
        }

        if (!"ACTIVE".equalsIgnoreCase(recipient.getAccountStatus())) {
            throw new BadRequestException("Recipient account is currently inactive or restricted.");
        }

        // 1. Locate Sender Source Account
        String rawFrom = req.getFromAccountNumber() != null ? req.getFromAccountNumber().trim() : "";
        Account from = accountRepository.findByAccountNumber(rawFrom).orElse(null);
        if (from == null) {
            List<Account> userAccounts = accountRepository.findByUserId(senderUserId);
            if (!userAccounts.isEmpty()) {
                from = userAccounts.get(0);
            } else {
                throw new ResourceNotFoundException("Source account not found: " + rawFrom);
            }
        }

        if (!from.getUser().getId().equals(senderUserId)) {
            throw new BadRequestException("Unauthorized: You do not own this source account");
        }

        if ("FROZEN".equalsIgnoreCase(from.getStatus()) || "BLOCKED".equalsIgnoreCase(from.getStatus())) {
            throw new BadRequestException("Your source account is currently frozen. Transfers are restricted.");
        }

        if (from.getDailyLimit() != null && req.getAmount().compareTo(from.getDailyLimit()) > 0) {
            throw new BadRequestException("Amount of ₹" + req.getAmount() + " exceeds your daily limit of ₹" + from.getDailyLimit());
        }

        // 2. Locate Recipient Target Account
        List<Account> recipientAccounts = accountRepository.findByUserId(recipient.getId());
        if (recipientAccounts.isEmpty()) {
            throw new BadRequestException("Recipient has no active bank accounts to receive funds.");
        }
        Account to = recipientAccounts.stream()
                .filter(Account::isPrimary)
                .findFirst()
                .orElse(recipientAccounts.get(0));

        BigDecimal fromBalance = from.getBalance() != null ? from.getBalance() : BigDecimal.ZERO;
        if (fromBalance.compareTo(req.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance in source account. Current balance: ₹" + fromBalance);
        }

        String riskLevel = calculateRiskLevel(req.getAmount(), false);

        // Execute Balance Deductions & Additions
        BigDecimal toBalance = to.getBalance() != null ? to.getBalance() : BigDecimal.ZERO;
        from.setBalance(fromBalance.subtract(req.getAmount()));
        to.setBalance(toBalance.add(req.getAmount()));

        accountRepository.save(from);
        accountRepository.save(to);

        String remarks = (req.getRemarks() != null && !req.getRemarks().trim().isEmpty()) ? req.getRemarks().trim() : "QR Transfer";

        // Create QR_TRANSFER Transaction on Sender
        Transaction debit = new Transaction();
        debit.setAccount(from);
        debit.setType(TransactionType.QR_TRANSFER);
        debit.setAmount(req.getAmount());
        debit.setBalanceAfter(from.getBalance());
        debit.setCounterpartyAccountNumber(to.getAccountNumber());
        debit.setDescription("Payment to " + recipient.getFullName() + " (" + remarks + ")");
        debit.setStatus("SUCCESS");
        debit.setRiskLevel(riskLevel);
        debit = transactionRepository.save(debit);

        // Create TRANSFER_IN Transaction on Recipient
        Transaction credit = new Transaction();
        credit.setAccount(to);
        credit.setType(TransactionType.TRANSFER_IN);
        credit.setAmount(req.getAmount());
        credit.setBalanceAfter(to.getBalance());
        credit.setCounterpartyAccountNumber(from.getAccountNumber());
        credit.setDescription("QR Payment received from " + from.getUser().getFullName() + " (" + remarks + ")");
        credit.setStatus("SUCCESS");
        credit.setRiskLevel(riskLevel);
        transactionRepository.save(credit);

        User sender = from.getUser();

        // Send Notifications
        notificationService.sendNotification(
                sender,
                "QR Transfer Successful",
                "₹" + req.getAmount().toPlainString() + " sent to " + recipient.getFullName() + " successfully.",
                "TRANSFER"
        );

        notificationService.sendNotification(
                recipient,
                "Payment Received",
                "You received ₹" + req.getAmount().toPlainString() + " from " + sender.getFullName() + ".",
                "TRANSFER"
        );

        if ("HIGH".equals(riskLevel)) {
            notificationService.sendNotification(
                    sender,
                    "High-Risk Transfer Alert",
                    "High-value QR transfer of ₹" + req.getAmount() + " completed with heightened security logging.",
                    "SECURITY"
            );
        }

        // Audit Log
        auditLogService.logAction(
                sender,
                from.getAccountNumber(),
                "QR_TRANSFER",
                "QR Transfer of ₹" + req.getAmount() + " to " + recipient.getFullName() + " [" + (recipient.getPublicPaymentId() != null ? recipient.getPublicPaymentId() : cleanPayId) + "]",
                req.getAmount(),
                "SUCCESS",
                riskLevel
        );

        String maskedToAcc = to.getAccountNumber().length() > 4 ? "****" + to.getAccountNumber().substring(to.getAccountNumber().length() - 4) : to.getAccountNumber();

        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "QR Transfer completed successfully");
        resp.put("amount", req.getAmount());
        resp.put("recipientName", recipient.getFullName());
        resp.put("payId", recipient.getPublicPaymentId() != null ? recipient.getPublicPaymentId() : cleanPayId);
        resp.put("fromAccount", from.getAccountNumber());
        resp.put("toAccountMasked", maskedToAcc);
        resp.put("newBalance", from.getBalance());
        resp.put("status", "SUCCESS");
        resp.put("riskLevel", riskLevel);
        resp.put("transactionId", "TXN-QRPAY-00" + debit.getId());
        resp.put("createdAt", java.time.LocalDateTime.now().toString());
        return resp;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTransactionHistory(Long userId, Long accountId) {
        accountService.getOwnedAccount(accountId, userId); // verify ownership

        return transactionRepository.findByAccountIdOrderByCreatedAtDesc(accountId)
                .stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    /**
     * Rule-Based Risk Calculation:
     * - Amount <= 50,000 -> LOW
     * - 50,001 to 1,00,000 -> MEDIUM
     * - Amount > 1,00,000 -> HIGH
     * - If new beneficiary -> elevate risk score
     */
    private String calculateRiskLevel(BigDecimal amount, boolean isNewBeneficiary) {
        if (amount == null) return "LOW";

        if (amount.compareTo(MEDIUM_RISK_THRESHOLD) > 0) {
            return "HIGH";
        } else if (amount.compareTo(LOW_RISK_THRESHOLD) > 0) {
            return isNewBeneficiary ? "HIGH" : "MEDIUM";
        } else {
            return isNewBeneficiary ? "MEDIUM" : "LOW";
        }
    }

    private boolean isNewPayee(Long accountId, String counterpartyAccNo) {
        List<Transaction> previous = transactionRepository.findByAccountIdOrderByCreatedAtDesc(accountId);
        return previous.stream()
                .noneMatch(t -> counterpartyAccNo.equalsIgnoreCase(t.getCounterpartyAccountNumber()));
    }

    private void checkSystemLimits(BigDecimal amount) {
        systemSettingRepository.findBySettingKey("max_transaction_limit").ifPresent(setting -> {
            try {
                BigDecimal maxLimit = new BigDecimal(setting.getSettingValue());
                if (amount.compareTo(maxLimit) > 0) {
                    throw new BadRequestException("Transaction amount of ₹" + amount + " exceeds platform system maximum limit of ₹" + maxLimit);
                }
            } catch (NumberFormatException ignored) {}
        });
    }

    private Map<String, Object> toMap(Transaction t) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", t.getId());
        map.put("type", t.getType().name());
        map.put("amount", t.getAmount());
        map.put("balanceAfter", t.getBalanceAfter());
        map.put("description", t.getDescription());
        map.put("counterpartyAccountNumber", t.getCounterpartyAccountNumber());
        map.put("status", t.getStatus() != null ? t.getStatus() : "SUCCESS");
        map.put("riskLevel", t.getRiskLevel() != null ? t.getRiskLevel() : "LOW");
        map.put("createdAt", t.getCreatedAt());
        return map;
    }
}
