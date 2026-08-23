package com.finsync.config;

import com.finsync.model.Account;
import com.finsync.model.AccountType;
import com.finsync.model.Transaction;
import com.finsync.model.TransactionType;
import com.finsync.model.User;
import com.finsync.repository.AccountRepository;
import com.finsync.repository.TransactionRepository;
import com.finsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    public void run(String... args) throws Exception {
        List<User> users = userRepository.findAll();
        for (int i = 0; i < users.size(); i++) {
            User u = users.get(i);
            List<Account> existing = accountRepository.findByUserId(u.getId());
            if (existing.isEmpty()) {
                // Generate distinct, realistic opening balances per user
                BigDecimal initialBalance = new BigDecimal(5000 + (i * 3500));

                Account acc = new Account();
                acc.setAccountNumber(generateUniqueAccountNumber());
                acc.setUser(u);
                acc.setAccountType(i % 3 == 0 ? AccountType.CURRENT : AccountType.SAVINGS);
                acc.setBalance(initialBalance);
                acc.setPrimary(true); // First created account is Primary Account
                acc = accountRepository.save(acc);

                Transaction txn = new Transaction();
                txn.setAccount(acc);
                txn.setType(TransactionType.DEPOSIT);
                txn.setAmount(initialBalance);
                txn.setBalanceAfter(initialBalance);
                txn.setDescription("Primary Account Opening Deposit");
                transactionRepository.save(txn);
            } else {
                // Ensure the first created account is marked as Primary
                Account firstAcc = existing.get(0);
                if (!firstAcc.isPrimary()) {
                    firstAcc.setPrimary(true);
                    accountRepository.save(firstAcc);
                }
            }
        }
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            long randomDigits = (long) (RANDOM.nextDouble() * 1_0000_000_000L);
            accountNumber = "FS" + String.format("%010d", randomDigits);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}
