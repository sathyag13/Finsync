package com.finsync.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class QrTransferRequest {

    @NotBlank(message = "Recipient Pay ID or QR data is required")
    public String payId;

    @NotBlank(message = "Source account number is required")
    public String fromAccountNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Transfer amount must be at least ₹0.01")
    public BigDecimal amount;

    public String remarks;
}
