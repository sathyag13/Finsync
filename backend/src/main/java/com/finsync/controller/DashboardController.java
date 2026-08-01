package com.finsync.controller;

import com.finsync.dto.DashboardResponse;
import com.finsync.model.User;
import com.finsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;

    @GetMapping("/api/dashboard")
    public DashboardResponse dashboard(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return DashboardResponse.builder()
                .message("Welcome to FinSync")
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}