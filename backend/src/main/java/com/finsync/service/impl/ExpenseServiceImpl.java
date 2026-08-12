package com.finsync.service.impl;

import com.finsync.dto.ExpenseRequest;
import com.finsync.exception.ResourceNotFoundException;
import com.finsync.exception.UnauthorizedAccessException;
import com.finsync.model.Expense;
import com.finsync.model.User;
import com.finsync.repository.ExpenseRepository;
import com.finsync.repository.UserRepository;
import com.finsync.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> addExpense(Long userId, ExpenseRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setAmount(req.amount);
        expense.setCategory(req.category);
        expense.setNote(req.note);
        expense.setExpenseDate(req.expenseDate != null ? req.expenseDate : LocalDate.now());

        expense = expenseRepository.save(expense);
        return toMap(expense);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUserExpenses(Long userId) {
        return expenseRepository.findByUserIdOrderByExpenseDateDesc(userId)
                .stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteExpense(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        if (!expense.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You do not own this expense record");
        }

        expenseRepository.delete(expense);
    }

    private Map<String, Object> toMap(Expense e) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", e.getId());
        map.put("amount", e.getAmount());
        map.put("category", e.getCategory());
        map.put("note", e.getNote());
        map.put("expenseDate", e.getExpenseDate());
        return map;
    }
}
