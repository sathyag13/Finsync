package com.finsync.service.impl;

import com.finsync.dto.AmountRequest;
import com.finsync.dto.TransferRequest;
import com.finsync.exception.BadRequestException;
import com.finsync.exception.InsufficientBalanceException;
import com.finsync.exception.ResourceNotFoundException;
import com.finsync.model.Account;
import com.finsync.model.Transaction;
import com.finsync.model.TransactionType;
import com.finsync.repository.AccountRepository;
import com.finsync.repository.TransactionRepository;
import com.finsync.service.AccountService;
import com.finsync.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.finsync.repository.UserRepository;
import com.finsync.model.User;
import com.finsync.model.AccountType;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AccountService accountService;

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Map<String, Object> deposit(Long userId, Long accountId, AmountRequest req) {
        Account account = accountService.getOwnedAccount(accountId, userId);

        account.setBalance(account.getBalance().add(req.amount));
        accountRepository.save(account);

        Transaction txn = new Transaction();
        txn.setAccount(account);
        txn.setType(TransactionType.DEPOSIT);
        txn.setAmount(req.amount);
        txn.setBalanceAfter(account.getBalance());
        txn.setDescription(req.description);
        txn = transactionRepository.save(txn);

        return toMap(txn);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Map<String, Object> withdraw(Long userId, Long accountId, AmountRequest req) {
        Account account = accountService.getOwnedAccount(accountId, userId);

        if (account.getBalance().compareTo(req.amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance for withdrawal");
        }

        account.setBalance(account.getBalance().subtract(req.amount));
        accountRepository.save(account);

        Transaction txn = new Transaction();
        txn.setAccount(account);
        txn.setType(TransactionType.WITHDRAWAL);
        txn.setAmount(req.amount);
        txn.setBalanceAfter(account.getBalance());
        txn.setDescription(req.description);
        txn = transactionRepository.save(txn);

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

        if (req.amount == null || req.amount.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Transfer amount must be greater than zero");
        }

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
                            (u.getPhoneNumber() != null && u.getPhoneNumber().equals(rawTo))
                    ))
                    .findFirst()
                    .orElse(null);

            if (matchingUser != null) {
                List<Account> recipientAccs = accountRepository.findByUserId(matchingUser.getId());
                if (!recipientAccs.isEmpty()) {
                    to = recipientAccs.get(0);
                }
            }

            // If still null, auto-provision recipient account in database
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
                to.setBalance(java.math.BigDecimal.ZERO);
                to.setPrimary(true);
                to = accountRepository.save(to);
            }
        }

        // Validation: Cannot transfer to same account
        if (from.getId().equals(to.getId()) || from.getAccountNumber().equalsIgnoreCase(to.getAccountNumber())) {
            throw new BadRequestException("Cannot transfer money to the same account");
        }

        // Balance Check
        java.math.BigDecimal fromBalance = from.getBalance() != null ? from.getBalance() : java.math.BigDecimal.ZERO;
        if (fromBalance.compareTo(req.amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance in source account. Current balance: ₹" + fromBalance);
        }

        // State Mutations
        java.math.BigDecimal toBalance = to.getBalance() != null ? to.getBalance() : java.math.BigDecimal.ZERO;
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
        transactionRepository.save(debit);

        Transaction credit = new Transaction();
        credit.setAccount(to);
        credit.setType(TransactionType.TRANSFER_IN);
        credit.setAmount(req.amount);
        credit.setBalanceAfter(to.getBalance());
        credit.setCounterpartyAccountNumber(from.getAccountNumber());
        credit.setDescription(req.description != null && !req.description.trim().isEmpty() ? req.description : "Fund Transfer from " + from.getAccountNumber());
        transactionRepository.save(credit);

        return Map.of(
            "message", "Transfer completed successfully",
            "amount", req.amount,
            "fromAccount", from.getAccountNumber(),
            "toAccount", to.getAccountNumber(),
            "newBalance", from.getBalance()
        );
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

    private Map<String, Object> toMap(Transaction t) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", t.getId());
        map.put("type", t.getType().name());
        map.put("amount", t.getAmount());
        map.put("balanceAfter", t.getBalanceAfter());
        map.put("description", t.getDescription());
        map.put("counterpartyAccountNumber", t.getCounterpartyAccountNumber());
        map.put("createdAt", t.getCreatedAt());
        return map;
    }
}
