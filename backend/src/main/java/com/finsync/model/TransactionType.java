package com.finsync.model;

/**
 * Every row in the transactions table is one of these four kinds.
 * A transfer between two accounts creates TWO rows: a TRANSFER_OUT on
 * the sender's account and a TRANSFER_IN on the receiver's account.
 */
public enum TransactionType {
    DEPOSIT,
    WITHDRAWAL,
    TRANSFER_IN,
    TRANSFER_OUT,
    QR_TRANSFER
}
