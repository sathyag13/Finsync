package com.finsync.service.impl;

import com.finsync.dto.LoginRequest;
import com.finsync.dto.RegisterRequest;
import com.finsync.exception.BadRequestException;
import com.finsync.model.Role;
import com.finsync.model.User;
import com.finsync.repository.UserRepository;
import com.finsync.security.JwtUtil;
import com.finsync.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email)) {
            throw new BadRequestException("Email already registered");
        }

        Role targetRole = req.role != null ? req.role : Role.CUSTOMER;

        if (targetRole == Role.ANALYST || targetRole == Role.ADMIN) {
            if (req.empNo == null || req.empNo.trim().isEmpty()) {
                throw new BadRequestException("Employee Number (empNo) is required for " + targetRole.name() + " registration");
            }
        }

        User user = new User();
        user.setFullName(req.fullName);
        user.setEmail(req.email);
        user.setPhoneNumber(req.phoneNumber);
        user.setPassword(passwordEncoder.encode(req.password));
        user.setRole(targetRole);
        user.setEmpNo(req.empNo != null ? req.empNo.trim() : null);

        user = userRepository.save(user);
        return buildLoginResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> login(LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email, req.password));
        } catch (Exception e) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userRepository.findByEmail(req.email)
                .orElseThrow(() -> new BadRequestException("User account not found"));
        return buildLoginResponse(user);
    }

    private Map<String, Object> buildLoginResponse(User user) {
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());

        return Map.of(
                "token", token,
                "userId", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : "",
                "role", user.getRole().name(),
                "empNo", user.getEmpNo() != null ? user.getEmpNo() : ""
        );
    }
}
