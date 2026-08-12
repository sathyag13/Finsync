package com.finsync.service;

import com.finsync.dto.LoginRequest;
import com.finsync.dto.RegisterRequest;

import java.util.Map;

public interface AuthService {
    Map<String, Object> register(RegisterRequest req);
    Map<String, Object> login(LoginRequest req);
}
