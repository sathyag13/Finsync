package com.finsync.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Represents the JSON body of a POST /api/auth/register request, e.g.
 *   { "fullName": "Sathya", "email": "a@b.com", "password": "secret123" }
 *
 * We keep this as plain public fields (no Lombok, no getters/setters)
 * so you can see exactly what's expected at a glance. Spring's JSON
 * library (Jackson) reads/writes public fields automatically.
 */
public class RegisterRequest {

    @NotBlank
    public String fullName;

    @NotBlank
    @Email
    public String email;

    @NotBlank
    public String password;

    public String phoneNumber;
}
