package com.finsync.model;

/**
 * The two kinds of users in the system. Stored as a String in the
 * database (see @Enumerated(EnumType.STRING) on User.role).
 */
public enum Role {
    CUSTOMER,
    ADMIN
}
