package com.finsync.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/** Body of a POST /api/savings-goals request. */
public class SavingsGoalRequest {

    @NotBlank
    public String goalName;

    @NotNull
    public BigDecimal targetAmount;
}
