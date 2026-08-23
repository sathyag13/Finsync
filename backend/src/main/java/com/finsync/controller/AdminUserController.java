package com.finsync.controller;

import com.finsync.model.Account;
import com.finsync.model.Role;
import com.finsync.model.Transaction;
import com.finsync.model.User;
import com.finsync.repository.AccountRepository;
import com.finsync.repository.TransactionRepository;
import com.finsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("fullName", u.getFullName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole() != null ? u.getRole().name() : "CUSTOMER");
            map.put("accountStatus", u.getAccountStatus() != null ? u.getAccountStatus() : "ACTIVE");
            map.put("empNo", u.getEmpNo() != null ? u.getEmpNo() : "");
            map.put("phoneNumber", u.getPhoneNumber() != null ? u.getPhoneNumber() : "");
            map.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : LocalDateTime.now().toString());
            map.put("lastLogin", u.getLastLogin() != null ? u.getLastLogin().toString() : "2026-08-15T18:30:00");
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }

        User user = new User();
        user.setFullName(body.getOrDefault("fullName", "New User"));
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(body.getOrDefault("password", "Secret123!")));
        user.setPhoneNumber(body.get("phoneNumber"));
        user.setEmpNo(body.get("empNo"));
        
        String roleStr = body.getOrDefault("role", "CUSTOMER");
        try {
            user.setRole(Role.valueOf(roleStr));
        } catch (Exception e) {
            user.setRole(Role.CUSTOMER);
        }
        user.setAccountStatus("ACTIVE");

        user = userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User created successfully", "id", user.getId()));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (body.containsKey("fullName")) user.setFullName(body.get("fullName"));
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        if (body.containsKey("phoneNumber")) user.setPhoneNumber(body.get("phoneNumber"));
        if (body.containsKey("empNo")) user.setEmpNo(body.get("empNo"));
        if (body.containsKey("role")) {
            try {
                user.setRole(Role.valueOf(body.get("role")));
            } catch (Exception ignored) {}
        }
        if (body.containsKey("accountStatus")) user.setAccountStatus(body.get("accountStatus"));

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User updated successfully"));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String newStatus = body.get("accountStatus");
        if (newStatus != null) {
            user.setAccountStatus(newStatus);
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.of("message", "Account status updated to " + newStatus));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String roleStr = body.get("role");
        if (roleStr != null) {
            try {
                user.setRole(Role.valueOf(roleStr));
                userRepository.save(user);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid role"));
            }
        }

        return ResponseEntity.ok(Map.of("message", "Role updated successfully"));
    }

    @GetMapping("/audit-logs")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getAuditLogs() {
        List<Transaction> transactions = transactionRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Transaction t : transactions) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", t.getId());
            map.put("action", t.getType() != null ? t.getType().name() : "DEPOSIT");
            
            String holderName = "Valued Client";
            String accNo = "";
            try {
                if (t.getAccount() != null) {
                    accNo = t.getAccount().getAccountNumber() != null ? t.getAccount().getAccountNumber() : "";
                    if (t.getAccount().getUser() != null && t.getAccount().getUser().getFullName() != null) {
                        holderName = t.getAccount().getUser().getFullName();
                    }
                }
            } catch (Exception ignored) {}

            map.put("performedBy", holderName);
            map.put("accountNumber", accNo);
            map.put("amount", t.getAmount() != null ? t.getAmount() : java.math.BigDecimal.ZERO);
            map.put("balanceAfter", t.getBalanceAfter() != null ? t.getBalanceAfter() : java.math.BigDecimal.ZERO);
            map.put("target", t.getDescription() != null ? t.getDescription() : (t.getCounterpartyAccountNumber() != null ? "Transfer to " + t.getCounterpartyAccountNumber() : "Bank Operation"));
            map.put("timestamp", t.getCreatedAt() != null ? t.getCreatedAt().toString() : LocalDateTime.now().toString());
            map.put("status", "SUCCESS");
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/accounts")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Account a : accounts) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("accountNumber", a.getAccountNumber());
            map.put("accountType", a.getAccountType() != null ? a.getAccountType().name() : "SAVINGS");
            map.put("balance", a.getBalance() != null ? a.getBalance() : java.math.BigDecimal.ZERO);
            
            String holderName = "Valued Client";
            String email = "";
            try {
                if (a.getUser() != null) {
                    if (a.getUser().getFullName() != null) holderName = a.getUser().getFullName();
                    if (a.getUser().getEmail() != null) email = a.getUser().getEmail();
                }
            } catch (Exception ignored) {}

            map.put("userName", holderName);
            map.put("userEmail", email);
            map.put("createdAt", LocalDateTime.now().toString());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/transactions")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Transaction t : transactions) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", t.getId());
            
            String accNo = "";
            String holderName = "Valued Client";
            try {
                if (t.getAccount() != null) {
                    accNo = t.getAccount().getAccountNumber() != null ? t.getAccount().getAccountNumber() : "";
                    if (t.getAccount().getUser() != null && t.getAccount().getUser().getFullName() != null) {
                        holderName = t.getAccount().getUser().getFullName();
                    }
                }
            } catch (Exception ignored) {}

            map.put("accountNumber", accNo);
            map.put("userName", holderName);
            map.put("type", t.getType() != null ? t.getType().name() : "DEPOSIT");
            map.put("amount", t.getAmount() != null ? t.getAmount() : java.math.BigDecimal.ZERO);
            map.put("balanceAfter", t.getBalanceAfter() != null ? t.getBalanceAfter() : java.math.BigDecimal.ZERO);
            map.put("counterpartyAccountNumber", t.getCounterpartyAccountNumber());
            map.put("description", t.getDescription() != null ? t.getDescription() : "Bank Operation");
            map.put("createdAt", t.getCreatedAt() != null ? t.getCreatedAt().toString() : LocalDateTime.now().toString());
            map.put("status", "SUCCESS");
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}
