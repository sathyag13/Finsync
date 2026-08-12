package com.finsync.dto;

import jakarta.validation.constraints.NotBlank;

/** Body of a POST /api/auth/login request. */
public class LoginRequest {

    @NotBlank
    public String email;

    @NotBlank
    public String password;
}
