package com.finsync.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private Long transactionId;

    private String transactionType;

    private String accountNumber;

    private BigDecimal amount;

    private BigDecimal balance;

    private LocalDateTime transactionDate;

    private String message;

}