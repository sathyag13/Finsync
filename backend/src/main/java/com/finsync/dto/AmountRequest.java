package com.finsync.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/** Body of a deposit or withdraw request. */
public class AmountRequest {

    @NotNull
    public BigDecimal amount;

    public String description;
}
