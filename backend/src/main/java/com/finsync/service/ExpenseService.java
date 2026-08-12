package com.finsync.service;

import com.finsync.dto.ExpenseRequest;

import java.util.List;
import java.util.Map;

public interface ExpenseService {
    Map<String, Object> addExpense(Long userId, ExpenseRequest req);
    List<Map<String, Object>> getUserExpenses(Long userId);
    void deleteExpense(Long userId, Long expenseId);
}
