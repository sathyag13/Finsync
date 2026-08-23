package com.finsync.service;

import com.finsync.dto.ChangePasswordRequest;
import com.finsync.dto.LoginRequest;
import com.finsync.dto.RegisterRequest;

import java.util.Map;

public interface AuthService {
    Map<String, Object> register(RegisterRequest req);
    Map<String, Object> login(LoginRequest req);
    Map<String, Object> changePassword(Long userId, ChangePasswordRequest req);
    Map<String, Object> updateProfile(Long userId, Map<String, Object> updates);
    Map<String, Object> getProfile(Long userId);
}
