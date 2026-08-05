package com.finsync.service;

import com.finsync.dto.AccountResponse;
import com.finsync.dto.CreateAccountRequest;
import com.finsync.model.Account;
import com.finsync.model.User;
import com.finsync.repository.AccountRepository;
import com.finsync.repository.UserRepository;
import com.finsync.util.AccountNumberGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AccountNumberGenerator accountNumberGenerator;

    // ===========================
    // Create Bank Account
    // ===========================

    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request,
                                         Authentication authentication) {

        // Get logged-in user's email
        String email = authentication.getName();

        // Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create account
        Account account = Account.builder()
                .accountNumber(accountNumberGenerator.generateAccountNumber())
                .accountType(request.getAccountType())
                .balance(request.getInitialBalance())
                .user(user)
                .build();

        // Save into MySQL
        Account savedAccount = accountRepository.save(account);

        // Return response
        return AccountResponse.builder()
                .id(savedAccount.getId())
                .accountNumber(savedAccount.getAccountNumber())
                .accountType(savedAccount.getAccountType())
                .balance(savedAccount.getBalance())
                .accountHolderName(user.getFullName())
                .build();
    }

    // ===========================
    // Get Logged-in User Accounts
    // ===========================

    public List<AccountResponse> getMyAccounts(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Account> accounts = accountRepository.findByUser(user);

        return accounts.stream()
                .map(account -> AccountResponse.builder()
                        .id(account.getId())
                        .accountNumber(account.getAccountNumber())
                        .accountType(account.getAccountType())
                        .balance(account.getBalance())
                        .accountHolderName(user.getFullName())
                        .build())
                .collect(Collectors.toList());
    }
}