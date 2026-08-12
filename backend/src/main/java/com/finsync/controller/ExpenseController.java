package com.finsync.controller;

import com.finsync.dto.ExpenseRequest;
import com.finsync.security.CurrentUser;
import com.finsync.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<?> addExpense(@Valid @RequestBody ExpenseRequest req) {
        return ResponseEntity.ok(expenseService.addExpense(currentUser.id(), req));
    }

    @GetMapping
    public ResponseEntity<?> getMyExpenses() {
        return ResponseEntity.ok(expenseService.getUserExpenses(currentUser.id()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(currentUser.id(), id);
        return ResponseEntity.ok(Map.of("message", "Expense deleted successfully"));
    }
}
