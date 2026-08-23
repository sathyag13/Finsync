package com.finsync.service.impl;

import com.finsync.dto.CardControlRequest;
import com.finsync.dto.CreateAccountRequest;
import com.finsync.exception.BadRequestException;
import com.finsync.exception.ResourceNotFoundException;
import com.finsync.exception.UnauthorizedAccessException;
import com.finsync.model.Account;
import com.finsync.model.Transaction;
import com.finsync.model.TransactionType;
import com.finsync.model.User;
import com.finsync.repository.AccountRepository;
import com.finsync.repository.SystemSettingRepository;
import com.finsync.repository.TransactionRepository;
import com.finsync.repository.UserRepository;
import com.finsync.service.AccountService;
import com.finsync.service.AuditLogService;
import com.finsync.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Map<String, Object> createAccount(Long userId, CreateAccountRequest req) {
        // Check system settings
        systemSettingRepository.findBySettingKey("account_creation_enabled").ifPresent(setting -> {
            if ("false".equalsIgnoreCase(setting.getSettingValue())) {
                throw new BadRequestException("New account creation is temporarily disabled by system administrator.");
            }
        });

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<Account> existingUserAccounts = accountRepository.findByUserId(userId);
        boolean isFirstAccount = existingUserAccounts.isEmpty();

        BigDecimal initialDeposit = req.openingBalance != null ? req.openingBalance : BigDecimal.ZERO;

        Account account = new Account();
        account.setAccountNumber(generateUniqueAccountNumber());
        account.setUser(user);
        account.setAccountType(req.accountType);
        account.setBalance(initialDeposit);
        account.setPrimary(isFirstAccount);
        account.setStatus("ACTIVE");
        account.setCardFrozen(false);
        account.setOnlineTxnEnabled(true);
        account.setContactlessEnabled(true);
        account.setInternationalTxnEnabled(false);
        account.setDailyLimit(new BigDecimal("50000.00"));
        account.setCreatedAt(LocalDateTime.now());

        account = accountRepository.save(account);

        // If opening deposit > 0, record initial deposit transaction in ledger
        if (initialDeposit.compareTo(BigDecimal.ZERO) > 0) {
            Transaction txn = new Transaction();
            txn.setAccount(account);
            txn.setType(TransactionType.DEPOSIT);
            txn.setAmount(initialDeposit);
            txn.setBalanceAfter(initialDeposit);
            txn.setDescription("Opening Deposit upon Account Creation");
            txn.setStatus("SUCCESS");
            txn.setRiskLevel("LOW");
            transactionRepository.save(txn);
        }

        notificationService.sendNotification(
                user,
                "New Account Opened",
                "Your new " + account.getAccountType() + " account (" + account.getAccountNumber() + ") has been activated.",
                "SYSTEM"
        );

        auditLogService.logAction(
                user,
                account.getAccountNumber(),
                "ACCOUNT_OPENED",
                "Opened " + account.getAccountType() + " account with opening deposit ₹" + initialDeposit,
                initialDeposit,
                "SUCCESS",
                "LOW"
        );

        return toMap(account, isFirstAccount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUserAccounts(Long userId) {
        List<Account> userAccounts = accountRepository.findByUserId(userId);
        return userAccounts.stream()
                .map(a -> toMap(a, a.isPrimary() || userAccounts.indexOf(a) == 0))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Account getOwnedAccount(Long accountId, Long userId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));
        if (!account.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You do not own this account");
        }
        return account;
    }

    @Override
    @Transactional
    public Map<String, Object> updateCardControls(Long userId, Long accountId, CardControlRequest req) {
        Account account = getOwnedAccount(accountId, userId);
        User user = account.getUser();

        boolean wasFrozen = account.isCardFrozen();

        if (req.cardFrozen != null) {
            account.setCardFrozen(req.cardFrozen);
        }
        if (req.onlineTxnEnabled != null) {
            account.setOnlineTxnEnabled(req.onlineTxnEnabled);
        }
        if (req.contactlessEnabled != null) {
            account.setContactlessEnabled(req.contactlessEnabled);
        }
        if (req.internationalTxnEnabled != null) {
            account.setInternationalTxnEnabled(req.internationalTxnEnabled);
        }
        if (req.dailyLimit != null && req.dailyLimit.compareTo(BigDecimal.ZERO) >= 0) {
            account.setDailyLimit(req.dailyLimit);
        }

        account = accountRepository.save(account);

        // Generate freeze/unfreeze notifications & audit logs
        if (req.cardFrozen != null && req.cardFrozen != wasFrozen) {
            if (account.isCardFrozen()) {
                notificationService.sendNotification(
                        user,
                        "Debit Card Frozen",
                        "Your virtual debit card for account " + account.getAccountNumber() + " has been temporarily FROZEN. Card transactions are disabled.",
                        "CARD_CONTROL"
                );
                auditLogService.logAction(
                        user,
                        account.getAccountNumber(),
                        "CARD_FREEZE",
                        "Customer froze virtual debit card for account " + account.getAccountNumber(),
                        null,
                        "SUCCESS",
                        "LOW"
                );
            } else {
                notificationService.sendNotification(
                        user,
                        "Debit Card Unfrozen",
                        "Your virtual debit card for account " + account.getAccountNumber() + " has been ACTIVE/UNFROZEN. Transactions restored.",
                        "CARD_CONTROL"
                );
                auditLogService.logAction(
                        user,
                        account.getAccountNumber(),
                        "CARD_UNFREEZE",
                        "Customer unfroze virtual debit card for account " + account.getAccountNumber(),
                        null,
                        "SUCCESS",
                        "LOW"
                );
            }
        } else {
            auditLogService.logAction(
                    user,
                    account.getAccountNumber(),
                    "CARD_CONTROLS_UPDATE",
                    "Updated debit card controls & daily limit (₹" + account.getDailyLimit() + ")",
                    null,
                    "SUCCESS",
                    "LOW"
            );
        }

        return toMap(account, account.isPrimary());
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            long randomDigits = (long) (RANDOM.nextDouble() * 1_0000_000_000L);
            accountNumber = "FS" + String.format("%010d", randomDigits);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    private Map<String, Object> toMap(Account a, boolean isPrimary) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", a.getId());
        map.put("accountNumber", a.getAccountNumber());
        map.put("accountType", a.getAccountType().name());
        map.put("balance", a.getBalance() != null ? a.getBalance() : BigDecimal.ZERO);
        map.put("availableBalance", a.getBalance() != null ? a.getBalance() : BigDecimal.ZERO);
        map.put("isPrimary", a.isPrimary() || isPrimary);
        map.put("status", a.getStatus() != null ? a.getStatus() : "ACTIVE");
        map.put("cardFrozen", a.isCardFrozen());
        map.put("onlineTxnEnabled", a.isOnlineTxnEnabled());
        map.put("contactlessEnabled", a.isContactlessEnabled());
        map.put("internationalTxnEnabled", a.isInternationalTxnEnabled());
        map.put("dailyLimit", a.getDailyLimit() != null ? a.getDailyLimit() : new BigDecimal("50000.00"));
        map.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toString() : LocalDateTime.now().toString());
        return map;
    }
}
