package com.finsync.dto;

import com.finsync.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {

    @NotBlank
    public String fullName;

    @NotBlank
    @Email
    public String email;

    @NotBlank
    public String password;

    public String phoneNumber;

    public Role role;

    public String empNo;
}
