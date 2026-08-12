package com.finsync.security;

import com.finsync.model.User;
import com.finsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * When someone tries to log in, Spring Security calls this class to
 * find the matching user by email, then compares the submitted
 * password (hashed) against the stored one.
 */
@Service
@RequiredArgsConstructor // Lombok: generates a constructor for the "final" field below
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with email: " + email));
        return new UserPrincipal(user);
    }
}
