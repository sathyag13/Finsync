package com.finsync.controller;

import com.finsync.dto.CreateAccountRequest;
import com.finsync.security.CurrentUser;
import com.finsync.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finsync.repository.AccountRepository;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final AccountRepository accountRepository;
    private final CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<?> createAccount(@Valid @RequestBody CreateAccountRequest req) {
        return ResponseEntity.ok(accountService.createAccount(currentUser.id(), req));
    }

    @GetMapping
    public ResponseEntity<?> getMyAccounts() {
        return ResponseEntity.ok(accountService.getUserAccounts(currentUser.id()));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllAccounts() {
        return ResponseEntity.ok(accountRepository.findAll().stream().map(a -> {
            String userName = "Valued Client";
            String userEmail = "";
            String userPhone = "";
            String userRole = "CUSTOMER";
            Long userId = null;
            try {
                if (a.getUser() != null) {
                    userId = a.getUser().getId();
                    if (a.getUser().getFullName() != null) userName = a.getUser().getFullName();
                    if (a.getUser().getEmail() != null) userEmail = a.getUser().getEmail();
                    if (a.getUser().getPhoneNumber() != null) userPhone = a.getUser().getPhoneNumber();
                    if (a.getUser().getRole() != null) userRole = a.getUser().getRole().name();
                }
            } catch (Exception ignored) {}

            java.util.Map<String, Object> result = new java.util.HashMap<>();
            result.put("id", a.getId());
            result.put("accountNumber", a.getAccountNumber());
            result.put("accountType", a.getAccountType() != null ? a.getAccountType().name() : "SAVINGS");
            result.put("balance", a.getBalance() != null ? a.getBalance() : java.math.BigDecimal.ZERO);
            result.put("isPrimary", a.isPrimary());
            result.put("userName", userName);
            result.put("userEmail", userEmail);
            result.put("userPhone", userPhone);
            result.put("userRole", userRole);
            result.put("userId", userId);
            return result;
        }).collect(Collectors.toList()));
    }
}
