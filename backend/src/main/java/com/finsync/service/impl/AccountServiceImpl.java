package com.finsync.service.impl;

import com.finsync.dto.CreateAccountRequest;
import com.finsync.exception.ResourceNotFoundException;
import com.finsync.exception.UnauthorizedAccessException;
import com.finsync.model.Account;
import com.finsync.model.User;
import com.finsync.repository.AccountRepository;
import com.finsync.repository.UserRepository;
import com.finsync.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.List;
import com.finsync.model.Transaction;
import com.finsync.model.TransactionType;
import com.finsync.repository.TransactionRepository;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Map<String, Object> createAccount(Long userId, CreateAccountRequest req) {
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
        account.setPrimary(isFirstAccount); // First created account is Primary Account

        account = accountRepository.save(account);

        // If opening deposit > 0, record initial deposit transaction in ledger
        if (initialDeposit.compareTo(BigDecimal.ZERO) > 0) {
            Transaction txn = new Transaction();
            txn.setAccount(account);
            txn.setType(TransactionType.DEPOSIT);
            txn.setAmount(initialDeposit);
            txn.setBalanceAfter(initialDeposit);
            txn.setDescription("Opening Deposit upon Account Creation");
            transactionRepository.save(txn);
        }

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
        map.put("balance", a.getBalance());
        map.put("isPrimary", a.isPrimary() || isPrimary);
        return map;
    }
}
