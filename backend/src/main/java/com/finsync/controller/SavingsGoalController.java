package com.finsync.controller;

import com.finsync.dto.ContributeRequest;
import com.finsync.dto.SavingsGoalRequest;
import com.finsync.security.CurrentUser;
import com.finsync.service.SavingsGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/savings-goals")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;
    private final CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<?> createGoal(@Valid @RequestBody SavingsGoalRequest req) {
        return ResponseEntity.ok(savingsGoalService.createGoal(currentUser.id(), req));
    }

    @GetMapping
    public ResponseEntity<?> getMyGoals() {
        return ResponseEntity.ok(savingsGoalService.getUserGoals(currentUser.id()));
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<?> contribute(@PathVariable Long id, @Valid @RequestBody ContributeRequest req) {
        return ResponseEntity.ok(savingsGoalService.contribute(currentUser.id(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        savingsGoalService.deleteGoal(currentUser.id(), id);
        return ResponseEntity.ok(Map.of("message", "Goal deleted successfully"));
    }
}
