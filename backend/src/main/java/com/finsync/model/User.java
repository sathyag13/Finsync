package com.finsync.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Represents one row in the "users" table — someone who can log in.
 *
 * @Entity tells Hibernate "this class maps to a database table."
 * @Getter / @Setter (from Lombok) auto-generate getX()/setX() methods
 * for every field below, so we don't have to type them by hand.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    // Stores the BCrypt HASH of the password, never the plain text.
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.CUSTOMER;

    private LocalDateTime createdAt;

    // Runs automatically right before this row is first saved.
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
