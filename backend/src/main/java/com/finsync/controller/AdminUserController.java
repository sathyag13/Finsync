package com.finsync.controller;

import com.finsync.model.Role;
import com.finsync.model.User;
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
    public ResponseEntity<List<Map<String, Object>>> getAuditLogs() {
        List<Map<String, Object>> logs = List.of(
                Map.of("id", 1, "action", "USER_ROLE_CHANGE", "performedBy", "Admin Sathya", "target", "Aarav Sharma (ID #2)", "timestamp", "2026-08-16 00:30:12", "status", "SUCCESS"),
                Map.of("id", 2, "action", "ACCOUNT_STATUS_LOCK", "performedBy", "Admin Sathya", "target", "Priya Patel (ID #3)", "timestamp", "2026-08-15 22:14:05", "status", "SUCCESS"),
                Map.of("id", 3, "action", "SYSTEM_SETTINGS_UPDATE", "performedBy", "Admin Sathya", "target", "Security Parameters", "timestamp", "2026-08-15 19:45:00", "status", "SUCCESS"),
                Map.of("id", 4, "action", "USER_REGISTERED", "performedBy", "System Self-Reg", "target", "Rahul Verma (ID #4)", "timestamp", "2026-08-14 11:20:10", "status", "SUCCESS"),
                Map.of("id", 5, "action", "HIGH_VALUE_TX_FLAGGED", "performedBy", "Fraud Detection Rules", "target", "Tx #99482 (₹18.5L)", "timestamp", "2026-08-13 14:05:44", "status", "REVIEWED")
        );
        return ResponseEntity.ok(logs);
    }
}
