package com.finsync.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/** Body of a POST /api/savings-goals/{id}/contribute request. */
public class ContributeRequest {

    @NotNull
    public BigDecimal amount;
}
