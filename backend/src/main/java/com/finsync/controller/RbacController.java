package com.finsync.controller;

import com.finsync.dto.RbacAnalyticsResponse;
import com.finsync.dto.UserRoleUpdateRequest;
import com.finsync.service.RbacService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rbac")
@RequiredArgsConstructor
public class RbacController {

    private final RbacService rbacService;

    @GetMapping("/analytics")
    public ResponseEntity<RbacAnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(rbacService.getAnalytics());
    }

    @PutMapping("/users/role")
    public ResponseEntity<?> updateUserRole(@Valid @RequestBody UserRoleUpdateRequest req) {
        return ResponseEntity.ok(rbacService.updateUserRole(req));
    }
}
