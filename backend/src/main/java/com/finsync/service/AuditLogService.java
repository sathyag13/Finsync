package com.finsync.service;

import com.finsync.model.AuditLog;
import com.finsync.model.User;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface AuditLogService {
    AuditLog logAction(String performedBy, String userEmail, String accountNumber, String action,
                       String description, BigDecimal amount, String status, String riskLevel);

    AuditLog logAction(User user, String accountNumber, String action, String description,
                       BigDecimal amount, String status, String riskLevel);

    List<Map<String, Object>> getAuditLogs(String customer, String action, String status, String riskLevel, String startDate, String endDate);
}
