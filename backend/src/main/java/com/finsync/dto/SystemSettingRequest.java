package com.finsync.dto;

import java.math.BigDecimal;

public class SystemSettingRequest {
    public BigDecimal maxTransactionLimit;
    public Boolean accountCreationEnabled;
    public Boolean maintenanceMode;
    public Boolean notificationsEnabled;
    public Boolean auditLoggingEnabled;
    public BigDecimal savingsVaultApy;
}
