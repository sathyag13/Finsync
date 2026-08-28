package com.finsync.service.impl;

import com.finsync.model.AuditLog;
import com.finsync.model.User;
import com.finsync.repository.AuditLogRepository;
import com.finsync.repository.SystemSettingRepository;
import com.finsync.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final SystemSettingRepository systemSettingRepository;

    private boolean isAuditLoggingEnabled() {
        return systemSettingRepository.findBySettingKey("audit_logging_enabled")
                .map(s -> !"false".equalsIgnoreCase(s.getSettingValue()))
                .orElse(true);
    }

    @Override
    @Transactional
    public AuditLog logAction(String performedBy, String userEmail, String accountNumber, String action,
                              String description, BigDecimal amount, String status, String riskLevel) {
        if (!isAuditLoggingEnabled()) return null;
        AuditLog log = new AuditLog();
        log.setPerformedBy(performedBy != null ? performedBy : "System");
        log.setUserEmail(userEmail);
        log.setAccountNumber(accountNumber);
        log.setAction(action != null ? action : "ACTIVITY");
        log.setDescription(description);
        log.setAmount(amount);
        log.setStatus(status != null ? status : "SUCCESS");
        log.setRiskLevel(riskLevel != null ? riskLevel : "LOW");
        return auditLogRepository.save(log);
    }

    @Override
    @Transactional
    public AuditLog logAction(User user, String accountNumber, String action, String description,
                              BigDecimal amount, String status, String riskLevel) {
        String name = user != null ? user.getFullName() : "Customer";
        String email = user != null ? user.getEmail() : "";
        return logAction(name, email, accountNumber, action, description, amount, status, riskLevel);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAuditLogs(String customer, String action, String status, String riskLevel, String startDate, String endDate) {
        List<AuditLog> allLogs = auditLogRepository.findAllByOrderByTimestampDesc();

        return allLogs.stream()
                .filter(log -> {
                    if (customer != null && !customer.trim().isEmpty()) {
                        String q = customer.trim().toLowerCase();
                        boolean matchName = log.getPerformedBy() != null && log.getPerformedBy().toLowerCase().contains(q);
                        boolean matchEmail = log.getUserEmail() != null && log.getUserEmail().toLowerCase().contains(q);
                        boolean matchAcc = log.getAccountNumber() != null && log.getAccountNumber().toLowerCase().contains(q);
                        if (!matchName && !matchEmail && !matchAcc) return false;
                    }
                    if (action != null && !action.trim().isEmpty() && !action.equalsIgnoreCase("ALL")) {
                        if (log.getAction() == null || !log.getAction().equalsIgnoreCase(action.trim())) return false;
                    }
                    if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
                        if (log.getStatus() == null || !log.getStatus().equalsIgnoreCase(status.trim())) return false;
                    }
                    if (riskLevel != null && !riskLevel.trim().isEmpty() && !riskLevel.equalsIgnoreCase("ALL")) {
                        if (log.getRiskLevel() == null || !log.getRiskLevel().equalsIgnoreCase(riskLevel.trim())) return false;
                    }
                    if (startDate != null && !startDate.trim().isEmpty()) {
                        try {
                            LocalDate sDate = LocalDate.parse(startDate.trim());
                            if (log.getTimestamp() != null && log.getTimestamp().toLocalDate().isBefore(sDate)) return false;
                        } catch (Exception ignored) {}
                    }
                    if (endDate != null && !endDate.trim().isEmpty()) {
                        try {
                            LocalDate eDate = LocalDate.parse(endDate.trim());
                            if (log.getTimestamp() != null && log.getTimestamp().toLocalDate().isAfter(eDate)) return false;
                        } catch (Exception ignored) {}
                    }
                    return true;
                })
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    private Map<String, Object> toMap(AuditLog l) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", l.getId());
        map.put("performedBy", l.getPerformedBy());
        map.put("userEmail", l.getUserEmail());
        map.put("accountNumber", l.getAccountNumber());
        map.put("action", l.getAction());
        map.put("description", l.getDescription());
        map.put("amount", l.getAmount());
        map.put("status", l.getStatus());
        map.put("riskLevel", l.getRiskLevel());
        map.put("timestamp", l.getTimestamp());
        return map;
    }
}
