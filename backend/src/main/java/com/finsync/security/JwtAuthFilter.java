package com.finsync.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * This filter runs once per incoming HTTP request, BEFORE it reaches
 * any @RestController. It looks for a header like:
 *
 *     Authorization: Bearer eyJhbGciOi...
 *
 * If the token is valid, it tells Spring Security "this request is
 * from user X" so that @RestController methods can check who's
 * calling (see CurrentUser.java).
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // strip off "Bearer "

            if (jwtUtil.isTokenValid(token)) {
                String email = jwtUtil.extractEmail(token);

                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    var authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    // This is what marks the request as "logged in" for the rest of the app.
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        // Always continue to the next filter / the controller, even if there was no token.
        // SecurityConfig decides which endpoints actually require login.
        filterChain.doFilter(request, response);
    }
}
