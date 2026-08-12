package com.finsync.service.impl;

import com.finsync.dto.ContributeRequest;
import com.finsync.dto.SavingsGoalRequest;
import com.finsync.exception.ResourceNotFoundException;
import com.finsync.exception.UnauthorizedAccessException;
import com.finsync.model.SavingsGoal;
import com.finsync.model.User;
import com.finsync.repository.SavingsGoalRepository;
import com.finsync.repository.UserRepository;
import com.finsync.service.SavingsGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavingsGoalServiceImpl implements SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> createGoal(Long userId, SavingsGoalRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        SavingsGoal goal = new SavingsGoal();
        goal.setUser(user);
        goal.setGoalName(req.goalName);
        goal.setTargetAmount(req.targetAmount);

        goal = savingsGoalRepository.save(goal);
        return toMap(goal);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUserGoals(Long userId) {
        return savingsGoalRepository.findByUserId(userId)
                .stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> contribute(Long userId, Long goalId, ContributeRequest req) {
        SavingsGoal goal = savingsGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + goalId));

        if (!goal.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You do not own this savings goal");
        }

        goal.setSavedAmount(goal.getSavedAmount().add(req.amount));
        if (goal.getSavedAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setAchieved(true);
        }

        goal = savingsGoalRepository.save(goal);
        return toMap(goal);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteGoal(Long userId, Long goalId) {
        SavingsGoal goal = savingsGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + goalId));

        if (!goal.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You do not own this savings goal");
        }

        savingsGoalRepository.delete(goal);
    }

    private Map<String, Object> toMap(SavingsGoal g) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", g.getId());
        map.put("goalName", g.getGoalName());
        map.put("targetAmount", g.getTargetAmount());
        map.put("savedAmount", g.getSavedAmount());
        map.put("achieved", g.isAchieved());
        return map;
    }
}
