package com.finsync.service;

import com.finsync.dto.ContributeRequest;
import com.finsync.dto.SavingsGoalRequest;

import java.util.List;
import java.util.Map;

public interface SavingsGoalService {
    Map<String, Object> createGoal(Long userId, SavingsGoalRequest req);
    List<Map<String, Object>> getUserGoals(Long userId);
    Map<String, Object> contribute(Long userId, Long goalId, ContributeRequest req);
    void deleteGoal(Long userId, Long goalId);
}
