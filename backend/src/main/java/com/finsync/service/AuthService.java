package com.finsync.service;

import com.finsync.dto.AuthResponse;
import com.finsync.dto.LoginRequest;
import com.finsync.dto.RegisterRequest;
import com.finsync.model.Role;
import com.finsync.model.User;
import com.finsync.repository.UserRepository;
import com.finsync.security.UserPrincipal;
import com.finsync.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // Register User
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new RuntimeException("Mobile number already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .mobileNumber(request.getMobileNumber())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .build();

        userRepository.save(user);

        return "User Registered Successfully";
    }

    // Login User
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserPrincipal userPrincipal = new UserPrincipal(user);

        String token = jwtUtil.generateToken(userPrincipal);

        return AuthResponse.builder()
                .token(token)
                .message("Login Successful")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}