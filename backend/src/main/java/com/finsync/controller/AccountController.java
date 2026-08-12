package com.finsync.controller;

import com.finsync.dto.CreateAccountRequest;
import com.finsync.security.CurrentUser;
import com.finsync.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<?> createAccount(@Valid @RequestBody CreateAccountRequest req) {
        return ResponseEntity.ok(accountService.createAccount(currentUser.id(), req));
    }

    @GetMapping
    public ResponseEntity<?> getMyAccounts() {
        return ResponseEntity.ok(accountService.getUserAccounts(currentUser.id()));
    }
}
