package com.finsync.service;

import com.finsync.dto.DepositRequest;
import com.finsync.dto.TransactionResponse;
import com.finsync.dto.TransferRequest;
import com.finsync.dto.WithdrawRequest;
import com.finsync.model.Account;
import com.finsync.model.Transaction;
import com.finsync.repository.AccountRepository;
import com.finsync.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public TransactionResponse deposit(DepositRequest request) {

        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setBalance(account.getBalance().add(request.getAmount()));

        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionType("DEPOSIT")
                .amount(request.getAmount())
                .account(account)
                .build();

        transactionRepository.save(transaction);

        return TransactionResponse.builder()
                .transactionId(transaction.getId())
                .transactionType(transaction.getTransactionType())
                .accountNumber(account.getAccountNumber())
                .amount(transaction.getAmount())
                .balance(account.getBalance())
                .transactionDate(transaction.getTransactionDate())
                .message("Amount Deposited Successfully")
                .build();
    }

    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request) {

        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient Balance");
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));

        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionType("WITHDRAW")
                .amount(request.getAmount())
                .account(account)
                .build();

        transactionRepository.save(transaction);

        return TransactionResponse.builder()
                .transactionId(transaction.getId())
                .transactionType(transaction.getTransactionType())
                .accountNumber(account.getAccountNumber())
                .amount(transaction.getAmount())
                .balance(account.getBalance())
                .transactionDate(transaction.getTransactionDate())
                .message("Amount Withdrawn Successfully")
                .build();
    }

    @Transactional
    public TransactionResponse transfer(TransferRequest request) {

        Account fromAccount = accountRepository.findByAccountNumber(request.getFromAccountNumber())
                .orElseThrow(() -> new RuntimeException("Sender Account not found"));

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber())
                .orElseThrow(() -> new RuntimeException("Receiver Account not found"));

        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient Balance");
        }

        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        Transaction transaction = Transaction.builder()
                .transactionType("TRANSFER")
                .amount(request.getAmount())
                .account(fromAccount)
                .build();

        transactionRepository.save(transaction);

        return TransactionResponse.builder()
                .transactionId(transaction.getId())
                .transactionType(transaction.getTransactionType())
                .accountNumber(fromAccount.getAccountNumber())
                .amount(transaction.getAmount())
                .balance(fromAccount.getBalance())
                .transactionDate(transaction.getTransactionDate())
                .message("Money Transferred Successfully")
                .build();
    }

    public List<TransactionResponse> getTransactionHistory(String accountNumber) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return transactionRepository
                .findByAccountOrderByTransactionDateDesc(account)
                .stream()
                .map(transaction -> TransactionResponse.builder()
                        .transactionId(transaction.getId())
                        .transactionType(transaction.getTransactionType())
                        .accountNumber(account.getAccountNumber())
                        .amount(transaction.getAmount())
                        .balance(account.getBalance())
                        .transactionDate(transaction.getTransactionDate())
                        .build())
                .collect(Collectors.toList());
    }
}