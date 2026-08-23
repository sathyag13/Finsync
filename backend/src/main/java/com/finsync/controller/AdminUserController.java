package com.finsync.controller;

import com.finsync.model.Account;
import com.finsync.model.Role;
import com.finsync.model.Transaction;
import com.finsync.model.User;
import com.finsync.repository.AccountRepository;
import com.finsync.repository.TransactionRepository;
import com.finsync.repository.UserRepository;
import com.finsync.service.AuditLogService;
import com.finsync.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers(@RequestParam(required = false) String role) {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {
            if (role != null && !role.trim().isEmpty() && !role.equalsIgnoreCase("ALL")) {
                if (!role.equalsIgnoreCase(u.getRole() != null ? u.getRole().name() : "")) {
                    continue;
                }
            } else if (u.getRole() == Role.ADMIN) {
                // By default in the customer directory, do not list Admin accounts as retail customers
                continue;
            }

            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("fullName", u.getFullName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole() != null ? u.getRole().name() : "CUSTOMER");
            map.put("accountStatus", u.getAccountStatus() != null ? u.getAccountStatus() : "ACTIVE");
            map.put("kycStatus", u.getKycStatus() != null ? u.getKycStatus() : "VERIFIED");
            map.put("twoFactorEnabled", u.isTwoFactorEnabled());
            map.put("empNo", u.getEmpNo() != null ? u.getEmpNo() : "");
            map.put("phoneNumber", u.getPhoneNumber() != null ? u.getPhoneNumber() : "");
            map.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : LocalDateTime.now().toString());
            map.put("lastLogin", u.getLastLogin() != null ? u.getLastLogin().toString() : LocalDateTime.now().minusHours(2).toString());

            // Enrich with summary stats for user directory
            List<Account> userAccounts = accountRepository.findByUserId(u.getId());
            BigDecimal totalBalance = userAccounts.stream()
                    .map(a -> a.getBalance() != null ? a.getBalance() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            long txnCount = 0;
            String lastTxDate = null;
            for (Account a : userAccounts) {
                List<Transaction> txs = transactionRepository.findByAccountIdOrderByCreatedAtDesc(a.getId());
                txnCount += txs.size();
                if (!txs.isEmpty() && lastTxDate == null) {
                    lastTxDate = txs.get(0).getCreatedAt() != null ? txs.get(0).getCreatedAt().toString() : null;
                }
            }

            map.put("accountsCount", userAccounts.size());
            map.put("cardsCount", userAccounts.size()); // 1 virtual debit card per account
            map.put("totalBalance", totalBalance);
            map.put("transactionCount", txnCount);
            map.put("lastTransaction", lastTxDate != null ? lastTxDate : "No transactions yet");

            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/{id}/overview")
    public ResponseEntity<?> getCustomerOverview(@PathVariable Long id) {
        User u = userRepository.findById(id).orElse(null);
        if (u == null) return ResponseEntity.notFound().build();

        List<Account> userAccounts = accountRepository.findByUserId(u.getId());
        BigDecimal totalBalance = userAccounts.stream()
                .map(a -> a.getBalance() != null ? a.getBalance() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Map<String, Object>> recentTransactions = new ArrayList<>();
        long txnCount = 0;
        for (Account a : userAccounts) {
            List<Transaction> txs = transactionRepository.findByAccountIdOrderByCreatedAtDesc(a.getId());
            txnCount += txs.size();
            for (Transaction t : txs) {
                Map<String, Object> tMap = new HashMap<>();
                tMap.put("id", t.getId());
                tMap.put("accountNumber", a.getAccountNumber());
                tMap.put("type", t.getType().name());
                tMap.put("amount", t.getAmount());
                tMap.put("balanceAfter", t.getBalanceAfter());
                tMap.put("status", t.getStatus() != null ? t.getStatus() : "SUCCESS");
                tMap.put("riskLevel", t.getRiskLevel() != null ? t.getRiskLevel() : "LOW");
                tMap.put("description", t.getDescription());
                tMap.put("createdAt", t.getCreatedAt());
                recentTransactions.add(tMap);
            }
        }

        recentTransactions.sort((a, b) -> {
            LocalDateTime t1 = (LocalDateTime) a.get("createdAt");
            LocalDateTime t2 = (LocalDateTime) b.get("createdAt");
            if (t1 == null || t2 == null) return 0;
            return t2.compareTo(t1);
        });

        Map<String, Object> overview = new HashMap<>();
        overview.put("id", u.getId());
        overview.put("fullName", u.getFullName());
        overview.put("email", u.getEmail());
        overview.put("phoneNumber", u.getPhoneNumber());
        overview.put("role", u.getRole() != null ? u.getRole().name() : "CUSTOMER");
        overview.put("accountStatus", u.getAccountStatus());
        overview.put("kycStatus", u.getKycStatus());
        overview.put("twoFactorEnabled", u.isTwoFactorEnabled());
        overview.put("createdAt", u.getCreatedAt());
        overview.put("lastLogin", u.getLastLogin());
        overview.put("accountsCount", userAccounts.size());
        overview.put("cardsCount", userAccounts.size());
        overview.put("totalBalance", totalBalance);
        overview.put("transactionCount", txnCount);
        overview.put("accounts", userAccounts.stream().map(a -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("accountNumber", a.getAccountNumber());
            m.put("accountType", a.getAccountType().name());
            m.put("balance", a.getBalance());
            m.put("status", a.getStatus() != null ? a.getStatus() : "ACTIVE");
            m.put("cardFrozen", a.isCardFrozen());
            m.put("dailyLimit", a.getDailyLimit());
            return m;
        }).collect(Collectors.toList()));
        overview.put("recentTransactions", recentTransactions.stream().limit(10).collect(Collectors.toList()));

        return ResponseEntity.ok(overview);
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
        user.setKycStatus("VERIFIED");

        user = userRepository.save(user);

        auditLogService.logAction("Admin", "admin@finsync.in", "-", "USER_CREATE", "Admin created user " + user.getEmail() + " with role " + user.getRole(), null, "SUCCESS", "LOW");

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
        if (body.containsKey("kycStatus")) user.setKycStatus(body.get("kycStatus"));

        userRepository.save(user);

        auditLogService.logAction("Admin", "admin@finsync.in", "-", "USER_UPDATE", "Admin updated profile for user #" + id + " (" + user.getEmail() + ")", null, "SUCCESS", "LOW");

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

            notificationService.sendNotification(user, "Account Status Updated", "Your FinSync profile status is now: " + newStatus, "SECURITY");
            auditLogService.logAction("Admin", "admin@finsync.in", "-", "STATUS_CHANGE", "Changed status of user " + user.getEmail() + " to " + newStatus, null, "SUCCESS", "LOW");
        }

        return ResponseEntity.ok(Map.of("message", "Account status updated to " + newStatus));
    }

    @PatchMapping("/accounts/{id}/freeze")
    public ResponseEntity<?> toggleAccountFreeze(@PathVariable Long id) {
        Account account = accountRepository.findById(id).orElse(null);
        if (account == null) return ResponseEntity.notFound().build();

        String currentStatus = account.getStatus() != null ? account.getStatus() : "ACTIVE";
        String newStatus = "FROZEN".equalsIgnoreCase(currentStatus) ? "ACTIVE" : "FROZEN";
        account.setStatus(newStatus);
        account.setCardFrozen("FROZEN".equalsIgnoreCase(newStatus));
        accountRepository.save(account);

        User user = account.getUser();
        notificationService.sendNotification(
                user,
                "Account Status Notice",
                "Your account (" + account.getAccountNumber() + ") status has been updated to " + newStatus + " by Bank Administration.",
                "SECURITY"
        );

        auditLogService.logAction(
                "Admin",
                "admin@finsync.in",
                account.getAccountNumber(),
                "ACCOUNT_FREEZE_TOGGLE",
                "Toggled account " + account.getAccountNumber() + " status to " + newStatus,
                null,
                "SUCCESS",
                "LOW"
        );

        return ResponseEntity.ok(Map.of("message", "Account " + account.getAccountNumber() + " status updated to " + newStatus, "status", newStatus));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<Map<String, Object>>> getAuditLogs(
            @RequestParam(required = false) String customer,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String riskLevel,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        List<Map<String, Object>> logs = auditLogService.getAuditLogs(customer, action, status, riskLevel, startDate, endDate);
        return ResponseEntity.ok(logs);
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
            map.put("balance", a.getBalance() != null ? a.getBalance() : BigDecimal.ZERO);
            map.put("status", a.getStatus() != null ? a.getStatus() : "ACTIVE");
            map.put("cardFrozen", a.isCardFrozen());
            map.put("dailyLimit", a.getDailyLimit());
            map.put("isPrimary", a.isPrimary());
            
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
            map.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toString() : LocalDateTime.now().toString());
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
            map.put("amount", t.getAmount() != null ? t.getAmount() : BigDecimal.ZERO);
            map.put("balanceAfter", t.getBalanceAfter() != null ? t.getBalanceAfter() : BigDecimal.ZERO);
            map.put("counterpartyAccountNumber", t.getCounterpartyAccountNumber());
            map.put("description", t.getDescription() != null ? t.getDescription() : "Bank Operation");
            map.put("createdAt", t.getCreatedAt() != null ? t.getCreatedAt().toString() : LocalDateTime.now().toString());
            map.put("status", t.getStatus() != null ? t.getStatus() : "SUCCESS");
            map.put("riskLevel", t.getRiskLevel() != null ? t.getRiskLevel() : "LOW");
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}
