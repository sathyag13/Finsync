package com.finsync.repository;

import com.finsync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Extending JpaRepository gives us save(), findById(), findAll(),
 * delete(), etc. for free — no SQL to write. Spring Data also lets us
 * declare extra finder methods just by naming them correctly, like
 * the two below; Spring generates the SQL from the method name.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByPublicPaymentId(String publicPaymentId);

    boolean existsByPublicPaymentId(String publicPaymentId);

    java.util.List<User> findByRole(com.finsync.model.Role role);
}
