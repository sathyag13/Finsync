package com.finsync.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Body of a POST /api/expenses request. */
public class ExpenseRequest {

    @NotNull
    public BigDecimal amount;

    public String category;

    public String note;

    // Optional - if not sent, defaults to today
    public LocalDate expenseDate;
}
