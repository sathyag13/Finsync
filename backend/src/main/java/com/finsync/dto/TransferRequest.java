package com.finsync.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/** Body of a POST /api/transfer request. */
public class TransferRequest {

    @NotBlank
    public String fromAccountNumber;

    @NotBlank
    public String toAccountNumber;

    @NotNull
    public BigDecimal amount;

    public String description;
}
