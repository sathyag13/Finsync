package com.finsync.service;

import com.finsync.dto.BeneficiaryRequest;

import java.util.List;
import java.util.Map;

public interface BeneficiaryService {
    List<Map<String, Object>> getBeneficiaries(Long userId);
    Map<String, Object> addBeneficiary(Long userId, BeneficiaryRequest req);
    void deleteBeneficiary(Long userId, Long beneficiaryId);
}
