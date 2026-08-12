package com.finsync.service;

import com.finsync.dto.AmountRequest;
import com.finsync.dto.TransferRequest;

import java.util.List;
import java.util.Map;

public interface TransactionService {
    Map<String, Object> deposit(Long userId, Long accountId, AmountRequest req);
    Map<String, Object> withdraw(Long userId, Long accountId, AmountRequest req);
    Map<String, Object> transfer(Long userId, TransferRequest req);
    List<Map<String, Object>> getTransactionHistory(Long userId, Long accountId);
}
