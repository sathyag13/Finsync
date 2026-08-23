package com.finsync.service.impl;

import com.finsync.dto.LoginRequest;
import com.finsync.dto.RegisterRequest;
import com.finsync.exception.BadRequestException;
import com.finsync.model.Account;
import com.finsync.model.AccountType;
import com.finsync.model.Role;
import com.finsync.model.Transaction;
import com.finsync.model.TransactionType;
import com.finsync.model.User;
import com.finsync.repository.AccountRepository;
import com.finsync.repository.TransactionRepository;
import com.finsync.repository.UserRepository;
import com.finsync.security.JwtUtil;
import com.finsync.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
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

        user = userRepository.save(user);

        // Auto-provision primary Savings Account for user
        Account account = new Account();
        account.setAccountNumber(generateUniqueAccountNumber());
        account.setUser(user);
        account.setAccountType(AccountType.SAVINGS);
        account.setBalance(BigDecimal.ZERO); // New users start with ₹0.00 balance until funded
        account.setPrimary(true); // First created account is Primary Account
        account = accountRepository.save(account);

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

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if ("LOCKED".equalsIgnoreCase(user.getAccountStatus())) {
            throw new BadRequestException("Your account has been locked by bank administration. Access is restricted.");
        }

        if ("INACTIVE".equalsIgnoreCase(user.getAccountStatus()) || "SUSPENDED".equalsIgnoreCase(user.getAccountStatus())) {
            throw new BadRequestException("Your account is deactivated. Please contact bank administration.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email, req.password));
        } catch (org.springframework.security.authentication.LockedException e) {
            throw new BadRequestException("Your account has been locked by bank administration. Access is restricted.");
        } catch (org.springframework.security.authentication.DisabledException e) {
            throw new BadRequestException("Your account is deactivated. Please contact bank administration.");
        } catch (Exception e) {
            throw new BadRequestException("Invalid email or password");
        }

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
                "accountStatus", user.getAccountStatus() != null ? user.getAccountStatus() : "ACTIVE",
                "empNo", user.getEmpNo() != null ? user.getEmpNo() : ""
        );
    }
}
