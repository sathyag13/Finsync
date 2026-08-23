package com.finsync.repository;

import com.finsync.model.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    List<Beneficiary> findByUserIdOrderByCreatedAtDesc(Long userId);
    boolean existsByUserIdAndAccountNumber(Long userId, String accountNumber);
}
