package com.finsync.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A single ledger entry: one deposit, one withdrawal, or one half of
 * a transfer. This is what makes up an account's "transaction history."
 */
@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    // The account's balance right after this transaction was applied —
    // handy for showing a running balance in the UI.
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balanceAfter;

    // Only set for transfers: the OTHER account's number.
    private String counterpartyAccountNumber;

    private String description;

    @Column(nullable = false)
    private String status = "SUCCESS";

    @Column(nullable = false)
    private String riskLevel = "LOW";

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
