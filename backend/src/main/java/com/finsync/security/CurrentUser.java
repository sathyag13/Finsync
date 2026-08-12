package com.finsync.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * A tiny helper so controllers can write:
 *
 *     Long userId = currentUser.id();
 *
 * instead of digging through SecurityContextHolder every time.
 */
@Component
public class CurrentUser {

    public Long id() {
        UserPrincipal principal = (UserPrincipal)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal.getUserId();
    }
}
