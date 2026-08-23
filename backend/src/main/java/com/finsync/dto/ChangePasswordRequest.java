package com.finsync.dto;

import jakarta.validation.constraints.NotBlank;

public class ChangePasswordRequest {

    @NotBlank(message = "Current password is required")
    public String currentPassword;

    @NotBlank(message = "New password is required")
    public String newPassword;
}
