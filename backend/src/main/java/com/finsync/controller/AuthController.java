package com.finsync.controller;

import com.finsync.dto.ChangePasswordRequest;
import com.finsync.dto.LoginRequest;
import com.finsync.dto.RegisterRequest;
import com.finsync.security.CurrentUser;
import com.finsync.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CurrentUser currentUser;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        return ResponseEntity.ok(authService.changePassword(currentUser.id(), req));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(authService.getProfile(currentUser.id()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(authService.updateProfile(currentUser.id(), updates));
    }
}
