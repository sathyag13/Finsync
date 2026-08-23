package com.finsync.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * One bank account. Each account belongs to exactly one User, but a
 * User can own several accounts (that's the @ManyToOne below: many
 * accounts -> one user).
 */
@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String accountNumber;

    // "user_id" column in the DB stores the owning user's id.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType accountType;

    // BigDecimal (not double!) is the correct type for money — it
    // avoids floating-point rounding errors.
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean isPrimary = false;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(nullable = false)
    private boolean cardFrozen = false;

    @Column(nullable = false)
    private boolean onlineTxnEnabled = true;

    @Column(nullable = false)
    private boolean contactlessEnabled = true;

    @Column(nullable = false)
    private boolean internationalTxnEnabled = false;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal dailyLimit = new BigDecimal("50000.00");

    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = java.time.LocalDateTime.now();
        }
    }
}
