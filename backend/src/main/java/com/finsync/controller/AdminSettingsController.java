package com.finsync.controller;

import com.finsync.dto.SystemSettingRequest;
import com.finsync.model.SystemSetting;
import com.finsync.repository.SystemSettingRepository;
import com.finsync.security.CurrentUser;
import com.finsync.service.AuditLogService;
import com.finsync.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class AdminSettingsController {

    private final SystemSettingRepository systemSettingRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSettings() {
        Map<String, Object> result = new HashMap<>();
        result.put("maxTransactionLimit", getSettingDecimal("max_transaction_limit", new BigDecimal("500000.00")));
        result.put("accountCreationEnabled", getSettingBoolean("account_creation_enabled", true));
        result.put("maintenanceMode", getSettingBoolean("maintenance_mode", false));
        result.put("notificationsEnabled", getSettingBoolean("notifications_enabled", true));
        result.put("auditLoggingEnabled", getSettingBoolean("audit_logging_enabled", true));
        result.put("savingsVaultApy", getSettingDecimal("savings_vault_apy", new BigDecimal("5.50")));
        result.put("jwtLifetime", getSettingString("jwt_lifetime", "24h"));
        result.put("failedLockoutThreshold", getSettingInteger("failed_lockout_threshold", 3));
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<?> updateSettings(@RequestBody SystemSettingRequest req) {
        if (req.maxTransactionLimit != null) {
            saveOrUpdate("max_transaction_limit", req.maxTransactionLimit.toString(), "Maximum allowable transaction amount");
        }
        if (req.accountCreationEnabled != null) {
            saveOrUpdate("account_creation_enabled", req.accountCreationEnabled.toString(), "Flag to enable/disable account creation");
        }
        if (req.maintenanceMode != null) {
            saveOrUpdate("maintenance_mode", req.maintenanceMode.toString(), "System maintenance mode flag");
        }
        if (req.notificationsEnabled != null) {
            saveOrUpdate("notifications_enabled", req.notificationsEnabled.toString(), "Enable/disable real-time notification alerts");
        }
        if (req.auditLoggingEnabled != null) {
            saveOrUpdate("audit_logging_enabled", req.auditLoggingEnabled.toString(), "Enable/disable comprehensive transaction audit logging");
        }
        if (req.savingsVaultApy != null) {
            saveOrUpdate("savings_vault_apy", req.savingsVaultApy.toString(), "Platform savings vault APY percentage");
        }

        notificationService.sendNotificationToAdmins(
                "Global System Settings Updated",
                "System configuration and risk parameters were updated by Administrator.",
                "ADMIN_SYSTEM"
        );

        auditLogService.logAction(
                "Admin",
                "admin@finsync.in",
                "SYSTEM",
                "SETTINGS_UPDATE",
                "Updated global system settings and security parameters",
                null,
                "SUCCESS",
                "LOW"
        );

        return ResponseEntity.ok(Map.of("message", "System settings updated successfully"));
    }

    private void saveOrUpdate(String key, String value, String desc) {
        SystemSetting setting = systemSettingRepository.findBySettingKey(key).orElse(new SystemSetting(key, value, desc));
        setting.setSettingValue(value);
        setting.setDescription(desc);
        systemSettingRepository.save(setting);
    }

    private String getSettingString(String key, String def) {
        return systemSettingRepository.findBySettingKey(key).map(SystemSetting::getSettingValue).orElse(def);
    }

    private boolean getSettingBoolean(String key, boolean def) {
        return systemSettingRepository.findBySettingKey(key)
                .map(s -> Boolean.parseBoolean(s.getSettingValue()))
                .orElse(def);
    }

    private BigDecimal getSettingDecimal(String key, BigDecimal def) {
        return systemSettingRepository.findBySettingKey(key)
                .map(s -> {
                    try {
                        return new BigDecimal(s.getSettingValue());
                    } catch (Exception e) {
                        return def;
                    }
                })
                .orElse(def);
    }

    private int getSettingInteger(String key, int def) {
        return systemSettingRepository.findBySettingKey(key)
                .map(s -> {
                    try {
                        return Integer.parseInt(s.getSettingValue());
                    } catch (Exception e) {
                        return def;
                    }
                })
                .orElse(def);
    }
}
