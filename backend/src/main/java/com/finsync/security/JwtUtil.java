package com.finsync.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * A JWT ("JSON Web Token") is a signed string the server hands back
 * after a successful login. The browser/frontend stores it and sends
 * it back on every later request (in the "Authorization: Bearer ..."
 * header) so the server can identify who's calling without needing a
 * server-side session. This class creates and checks those tokens.
 */
@Component
public class JwtUtil {

    // Read from application.properties (finsync.jwt.secret)
    @Value("${finsync.jwt.secret}")
    private String secret;

    @Value("${finsync.jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /** Creates a new signed token for the given user. */
    public String generateToken(String email, Long userId, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(email)          // who this token belongs to
                .claim("userId", userId)    // extra data we stash inside the token
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /** Returns true if the token's signature is valid and it hasn't expired. */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /** Pulls the user's email back out of a valid token. */
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
