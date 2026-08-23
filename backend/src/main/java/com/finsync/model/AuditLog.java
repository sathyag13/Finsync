package com.finsync.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String performedBy;

    private String userEmail;

    private String accountNumber;

    @Column(nullable = false)
    private String action; // LOGIN, LOGOUT, TRANSFER, DEPOSIT, WITHDRAWAL, CARD_FREEZE, CARD_UNFREEZE, BENEFICIARY_ADD, BENEFICIARY_DELETE, SETTINGS_UPDATE

    @Column(length = 1000)
    private String description;

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String status = "SUCCESS"; // SUCCESS, FAILED, PENDING

    @Column(nullable = false)
    private String riskLevel = "LOW"; // LOW, MEDIUM, HIGH

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}
