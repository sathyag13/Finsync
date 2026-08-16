package com.finsync.service;

import com.finsync.dto.RbacAnalyticsResponse;
import com.finsync.dto.UserRoleUpdateRequest;

import java.util.Map;

public interface RbacService {
    RbacAnalyticsResponse getAnalytics();
    Map<String, Object> updateUserRole(UserRoleUpdateRequest req);
}
