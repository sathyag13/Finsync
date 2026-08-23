package com.finsync.dto;

import jakarta.validation.constraints.NotBlank;

public class BeneficiaryRequest {

    @NotBlank(message = "Beneficiary name is required")
    public String name;

    @NotBlank(message = "Bank name is required")
    public String bankName;

    @NotBlank(message = "Account number is required")
    public String accountNumber;

    @NotBlank(message = "IFSC code is required")
    public String ifsc;
}
