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

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
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
     * Atomicity: Debit source, credit recipient, and double-entry log records execute as an indivisible unit.
     * Isolation: Isolation.READ_COMMITTED prevents dirty reads during concurrent balance operations.
     */
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Map<String, Object> transfer(Long userId, TransferRequest req) {
        if (req.fromAccountNumber.equals(req.toAccountNumber)) {
            throw new BadRequestException("Cannot transfer money to the same account");
        }

        Account from = accountRepository.findByAccountNumber(req.fromAccountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Source account not found: " + req.fromAccountNumber));
        Account to = accountRepository.findByAccountNumber(req.toAccountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient account not found: " + req.toAccountNumber));

        if (!from.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not own the source account");
        }

        if (from.getBalance().compareTo(req.amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance in source account");
        }

        // Execute Atomicity & Consistency State Mutations
        from.setBalance(from.getBalance().subtract(req.amount));
        to.setBalance(to.getBalance().add(req.amount));

        accountRepository.save(from);
        accountRepository.save(to);

        // Double-Entry Ledger Bookkeeping
        Transaction debit = new Transaction();
        debit.setAccount(from);
        debit.setType(TransactionType.TRANSFER_OUT);
        debit.setAmount(req.amount);
        debit.setBalanceAfter(from.getBalance());
        debit.setCounterpartyAccountNumber(to.getAccountNumber());
        debit.setDescription(req.description);
        transactionRepository.save(debit);

        Transaction credit = new Transaction();
        credit.setAccount(to);
        credit.setType(TransactionType.TRANSFER_IN);
        credit.setAmount(req.amount);
        credit.setBalanceAfter(to.getBalance());
        credit.setCounterpartyAccountNumber(from.getAccountNumber());
        credit.setDescription(req.description);
        transactionRepository.save(credit);

        return Map.of("message", "Transfer completed successfully");
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
