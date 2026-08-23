package com.finsync.service.impl;

import com.finsync.dto.BeneficiaryRequest;
import com.finsync.exception.BadRequestException;
import com.finsync.exception.ResourceNotFoundException;
import com.finsync.model.Beneficiary;
import com.finsync.model.User;
import com.finsync.repository.BeneficiaryRepository;
import com.finsync.repository.UserRepository;
import com.finsync.service.AuditLogService;
import com.finsync.service.BeneficiaryService;
import com.finsync.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BeneficiaryServiceImpl implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getBeneficiaries(Long userId) {
        return beneficiaryRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> addBeneficiary(Long userId, BeneficiaryRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String accNo = req.accountNumber.trim();
        if (beneficiaryRepository.existsByUserIdAndAccountNumber(userId, accNo)) {
            throw new BadRequestException("Beneficiary with this account number already exists");
        }

        Beneficiary b = new Beneficiary();
        b.setUser(user);
        b.setName(req.name.trim());
        b.setBankName(req.bankName.trim());
        b.setAccountNumber(accNo);
        b.setIfsc(req.ifsc.trim().toUpperCase());
        b.setStatus("ACTIVE");
        b = beneficiaryRepository.save(b);

        notificationService.sendNotification(
                user,
                "New Payee Added",
                "Beneficiary " + b.getName() + " (" + b.getAccountNumber() + ") added to your payee directory.",
                "BENEFICIARY"
        );

        auditLogService.logAction(
                user,
                b.getAccountNumber(),
                "BENEFICIARY_ADD",
                "Added beneficiary " + b.getName() + " (" + b.getBankName() + ")",
                null,
                "SUCCESS",
                "LOW"
        );

        return toMap(b);
    }

    @Override
    @Transactional
    public void deleteBeneficiary(Long userId, Long beneficiaryId) {
        Beneficiary b = beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found"));

        if (!b.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Beneficiary does not belong to user");
        }

        User user = b.getUser();
        String bName = b.getName();
        String bAcc = b.getAccountNumber();

        beneficiaryRepository.delete(b);

        auditLogService.logAction(
                user,
                bAcc,
                "BENEFICIARY_DELETE",
                "Deleted beneficiary " + bName + " (" + bAcc + ")",
                null,
                "SUCCESS",
                "LOW"
        );
    }

    private Map<String, Object> toMap(Beneficiary b) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", b.getId());
        map.put("name", b.getName());
        map.put("bankName", b.getBankName());
        map.put("accountNumber", b.getAccountNumber());
        map.put("ifsc", b.getIfsc());
        map.put("status", b.getStatus());
        map.put("createdAt", b.getCreatedAt());
        return map;
    }
}
