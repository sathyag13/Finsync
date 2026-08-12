package com.finsync.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * One logged personal expense (separate from bank transactions — this
 * is for tracking spending, e.g. "₹500 on Groceries").
 */
@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    // Kept as free text (e.g. "Food", "Rent") to keep things simple —
    // no separate categories table.
    private String category;

    private String note;

    @Column(nullable = false)
    private LocalDate expenseDate;

    @PrePersist
    protected void onCreate() {
        if (this.expenseDate == null) {
            this.expenseDate = LocalDate.now();
        }
    }
}
