package com.finsync.controller;

import com.finsync.dto.BeneficiaryRequest;
import com.finsync.security.CurrentUser;
import com.finsync.service.BeneficiaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;
    private final CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<?> getMyBeneficiaries() {
        return ResponseEntity.ok(beneficiaryService.getBeneficiaries(currentUser.id()));
    }

    @PostMapping
    public ResponseEntity<?> addBeneficiary(@Valid @RequestBody BeneficiaryRequest req) {
        return ResponseEntity.ok(beneficiaryService.addBeneficiary(currentUser.id(), req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBeneficiary(@PathVariable Long id) {
        beneficiaryService.deleteBeneficiary(currentUser.id(), id);
        return ResponseEntity.ok(Map.of("message", "Beneficiary removed successfully"));
    }
}
