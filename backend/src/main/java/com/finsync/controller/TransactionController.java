package com.finsync.controller;

import com.finsync.dto.AmountRequest;
import com.finsync.dto.QrTransferRequest;
import com.finsync.dto.TransferRequest;
import com.finsync.security.CurrentUser;
import com.finsync.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final CurrentUser currentUser;

    @PostMapping("/accounts/{accountId}/deposit")
    public ResponseEntity<?> deposit(@PathVariable Long accountId, @Valid @RequestBody AmountRequest req) {
        return ResponseEntity.ok(transactionService.deposit(currentUser.id(), accountId, req));
    }

    @PostMapping("/accounts/{accountId}/withdraw")
    public ResponseEntity<?> withdraw(@PathVariable Long accountId, @Valid @RequestBody AmountRequest req) {
        return ResponseEntity.ok(transactionService.withdraw(currentUser.id(), accountId, req));
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@Valid @RequestBody TransferRequest req) {
        return ResponseEntity.ok(transactionService.transfer(currentUser.id(), req));
    }

    @GetMapping("/accounts/{accountId}/history")
    public ResponseEntity<?> history(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getTransactionHistory(currentUser.id(), accountId));
    }

    @GetMapping("/payments/recipient/{payId}")
    public ResponseEntity<?> resolveRecipient(@PathVariable String payId) {
        return ResponseEntity.ok(transactionService.resolveQrRecipient(currentUser.id(), payId));
    }

    @PostMapping("/payments/qr-transfer")
    public ResponseEntity<?> qrTransfer(@Valid @RequestBody QrTransferRequest req) {
        return ResponseEntity.ok(transactionService.processQrTransfer(currentUser.id(), req));
    }
}
