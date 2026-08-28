package com.finsync.service.impl;

import com.finsync.dto.ChangePasswordRequest;
import com.finsync.dto.LoginRequest;
import com.finsync.dto.RegisterRequest;
import com.finsync.exception.BadRequestException;
import com.finsync.exception.ResourceNotFoundException;
import com.finsync.model.Account;
import com.finsync.model.AccountType;
import com.finsync.model.Role;
import com.finsync.model.User;
import com.finsync.repository.AccountRepository;
import com.finsync.repository.UserRepository;
import com.finsync.security.JwtUtil;
import com.finsync.service.AuditLogService;
import com.finsync.service.AuthService;
import com.finsync.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email)) {
            throw new BadRequestException("Email already registered");
        }

        Role targetRole = req.role != null ? req.role : Role.CUSTOMER;

        if (targetRole == Role.ADMIN) {
            if (req.empNo == null || req.empNo.trim().isEmpty()) {
                req.empNo = String.valueOf(10000 + RANDOM.nextInt(90000));
            }
        }

        User user = new User();
        user.setFullName(req.fullName);
        user.setEmail(req.email);
        user.setPhoneNumber(req.phoneNumber);
        user.setPassword(passwordEncoder.encode(req.password));
        user.setRole(targetRole);
        user.setEmpNo(req.empNo != null ? req.empNo.trim() : null);
        user.setPublicPaymentId(generateUniquePaymentId());
        user.setAccountStatus("ACTIVE");
        user.setKycStatus("VERIFIED");
        user.setTwoFactorEnabled(false);
        user.setLastLogin(LocalDateTime.now());

        user = userRepository.save(user);

        // Auto-provision primary Savings Account for user
        Account account = new Account();
        account.setAccountNumber(generateUniqueAccountNumber());
        account.setUser(user);
        account.setAccountType(AccountType.SAVINGS);
        account.setBalance(BigDecimal.ZERO);
        account.setPrimary(true);
        account.setStatus("ACTIVE");
        account.setCardFrozen(false);
        account.setOnlineTxnEnabled(true);
        account.setContactlessEnabled(true);
        account.setInternationalTxnEnabled(false);
        account.setDailyLimit(new BigDecimal("50000.00"));
        account = accountRepository.save(account);

        notificationService.sendNotification(
                user,
                "Welcome to FinSync Bank",
                "Your FinSync account has been created. Your Primary Savings Account number is " + account.getAccountNumber() + ".",
                "SYSTEM"
        );

        if (user.getRole() == com.finsync.model.Role.CUSTOMER) {
            notificationService.sendNotificationToAdmins(
                    "New Customer Registered",
                    "Customer " + user.getFullName() + " (" + user.getEmail() + ") registered. Account #" + account.getAccountNumber() + " created.",
                    "ADMIN_USER"
            );
        }

        auditLogService.logAction(
                user,
                account.getAccountNumber(),
                "REGISTER",
                "User registered with email " + user.getEmail() + " (" + user.getRole() + ")",
                null,
                "SUCCESS",
                "LOW"
        );

        return buildLoginResponse(user);
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            long randomDigits = (long) (RANDOM.nextDouble() * 1_0000_000_000L);
            accountNumber = "FS" + String.format("%010d", randomDigits);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    private String generateUniquePaymentId() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        String payId;
        do {
            StringBuilder sb = new StringBuilder("FS-PAY-");
            for (int i = 0; i < 6; i++) {
                sb.append(chars.charAt(RANDOM.nextInt(chars.length())));
            }
            payId = sb.toString();
        } while (userRepository.existsByPublicPaymentId(payId));
        return payId;
    }

    @Override
    @Transactional
    public Map<String, Object> login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if ("LOCKED".equalsIgnoreCase(user.getAccountStatus())) {
            auditLogService.logAction(user.getFullName(), user.getEmail(), "-", "LOGIN_ATTEMPT", "Login blocked - Account is locked", null, "FAILED", "MEDIUM");
            throw new BadRequestException("Your account has been locked by bank administration. Access is restricted.");
        }

        if ("INACTIVE".equalsIgnoreCase(user.getAccountStatus()) || "SUSPENDED".equalsIgnoreCase(user.getAccountStatus())) {
            auditLogService.logAction(user.getFullName(), user.getEmail(), "-", "LOGIN_ATTEMPT", "Login blocked - Account is inactive", null, "FAILED", "MEDIUM");
            throw new BadRequestException("Your account is deactivated. Please contact bank administration.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email, req.password));
        } catch (Exception e) {
            auditLogService.logAction(user.getFullName(), user.getEmail(), "-", "LOGIN_FAILED", "Invalid credentials entered", null, "FAILED", "MEDIUM");
            throw new BadRequestException("Invalid email or password");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        auditLogService.logAction(user, "-", "LOGIN", "Customer successfully authenticated into FinSync NetBanking", null, "SUCCESS", "LOW");

        return buildLoginResponse(user);
    }

    @Override
    @Transactional
    public Map<String, Object> changePassword(Long userId, ChangePasswordRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(req.currentPassword, user.getPassword())) {
            throw new BadRequestException("Incorrect current password");
        }

        if (req.newPassword.length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters long");
        }

        user.setPassword(passwordEncoder.encode(req.newPassword));
        userRepository.save(user);

        notificationService.sendNotification(user, "Password Changed", "Your FinSync NetBanking password was recently updated.", "SECURITY");
        auditLogService.logAction(user, "-", "PASSWORD_CHANGE", "User updated account password", null, "SUCCESS", "LOW");

        return Map.of("message", "Password changed successfully");
    }

    @Override
    @Transactional
    public Map<String, Object> updateProfile(Long userId, Map<String, Object> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (updates.containsKey("phoneNumber")) {
            user.setPhoneNumber((String) updates.get("phoneNumber"));
        }
        if (updates.containsKey("twoFactorEnabled")) {
            user.setTwoFactorEnabled(Boolean.parseBoolean(updates.get("twoFactorEnabled").toString()));
        }

        user = userRepository.save(user);

        auditLogService.logAction(user, "-", "PROFILE_UPDATE", "User updated security & profile preferences", null, "SUCCESS", "LOW");

        return getProfile(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("fullName", user.getFullName());
        map.put("email", user.getEmail());
        map.put("phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : "");
        map.put("role", user.getRole().name());
        map.put("publicPaymentId", user.getPublicPaymentId() != null ? user.getPublicPaymentId() : "FS-PAY-" + user.getId());
        map.put("qrString", "FINSYNC://PAY?payId=" + (user.getPublicPaymentId() != null ? user.getPublicPaymentId() : "FS-PAY-" + user.getId()));
        map.put("accountStatus", user.getAccountStatus() != null ? user.getAccountStatus() : "ACTIVE");
        map.put("kycStatus", user.getKycStatus() != null ? user.getKycStatus() : "VERIFIED");
        map.put("twoFactorEnabled", user.isTwoFactorEnabled());
        map.put("empNo", user.getEmpNo() != null ? user.getEmpNo() : "");
        map.put("createdAt", user.getCreatedAt());
        map.put("lastLogin", user.getLastLogin());
        return map;
    }

    private Map<String, Object> buildLoginResponse(User user) {
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());

        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("userId", user.getId());
        res.put("fullName", user.getFullName());
        res.put("email", user.getEmail());
        res.put("phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : "");
        res.put("role", user.getRole().name());
        res.put("publicPaymentId", user.getPublicPaymentId() != null ? user.getPublicPaymentId() : "FS-PAY-" + user.getId());
        res.put("qrString", "FINSYNC://PAY?payId=" + (user.getPublicPaymentId() != null ? user.getPublicPaymentId() : "FS-PAY-" + user.getId()));
        res.put("accountStatus", user.getAccountStatus() != null ? user.getAccountStatus() : "ACTIVE");
        res.put("kycStatus", user.getKycStatus() != null ? user.getKycStatus() : "VERIFIED");
        res.put("twoFactorEnabled", user.isTwoFactorEnabled());
        res.put("empNo", user.getEmpNo() != null ? user.getEmpNo() : "");
        res.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : LocalDateTime.now().toString());
        res.put("lastLogin", user.getLastLogin() != null ? user.getLastLogin().toString() : LocalDateTime.now().toString());
        return res;
    }
}
