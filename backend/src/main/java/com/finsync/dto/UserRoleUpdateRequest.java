package com.finsync.dto;

import com.finsync.model.Role;
import jakarta.validation.constraints.NotNull;

public class UserRoleUpdateRequest {
    @NotNull
    public Long userId;

    @NotNull
    public Role newRole;
}
