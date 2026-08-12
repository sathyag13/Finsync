package com.finsync.service;

import com.finsync.dto.CreateAccountRequest;
import com.finsync.model.Account;

import java.util.List;
import java.util.Map;

public interface AccountService {
    Map<String, Object> createAccount(Long userId, CreateAccountRequest req);
    List<Map<String, Object>> getUserAccounts(Long userId);
    Account getOwnedAccount(Long accountId, Long userId);
}
