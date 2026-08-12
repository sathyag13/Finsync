package com.finsync.dto;

import com.finsync.model.AccountType;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/** Body of a POST /api/accounts request. */
public class CreateAccountRequest {

    @NotNull
    public AccountType accountType;

    // Optional - if not sent, the account starts at ₹0
    public BigDecimal openingBalance;
}
