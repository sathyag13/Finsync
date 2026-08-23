package com.finsync.service.impl;

import com.finsync.dto.RbacAnalyticsResponse;
import com.finsync.dto.UserRoleUpdateRequest;
import com.finsync.exception.ResourceNotFoundException;
import com.finsync.model.Account;
import com.finsync.model.Role;
import com.finsync.model.User;
import com.finsync.repository.AccountRepository;
import com.finsync.repository.UserRepository;
import com.finsync.service.RbacService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RbacServiceImpl implements RbacService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @Override
    @Transactional(readOnly = true)
    public RbacAnalyticsResponse getAnalytics() {
        List<User> users = userRepository.findAll();
        List<Account> accounts = accountRepository.findAll();

        double totalBalances = accounts.stream()
                .mapToDouble(a -> a.getBalance() != null ? a.getBalance().doubleValue() : 0.0)
                .sum();

        long customerCount = users.stream().filter(u -> u.getRole() == Role.CUSTOMER).count();
        long adminCount = users.stream().filter(u -> u.getRole() == Role.ADMIN).count();

        RbacAnalyticsResponse response = new RbacAnalyticsResponse();
        response.totalUsers = users.size();
        response.totalAccounts = accounts.size();
        response.customerCount = customerCount;
        response.analystCount = 0;
        response.adminCount = adminCount;

        // Assets Under Management (Sum of all real account balances in database)
        response.totalAssetsUnderManagement = totalBalances;
        response.totalTransactionsVolume = totalBalances;

        // Asset Class Allocation Breakdown
        response.assetAllocations = List.of(
                new RbacAnalyticsResponse.AssetAllocationDto("Equities & Stocks", 58000000.0, 38.6, "#6366f1"),
                new RbacAnalyticsResponse.AssetAllocationDto("Mutual Funds (SIP)", 39000000.0, 26.0, "#10b981"),
                new RbacAnalyticsResponse.AssetAllocationDto("Fixed Deposits (FD)", 27000000.0, 18.0, "#f59e0b"),
                new RbacAnalyticsResponse.AssetAllocationDto("Sovereign Gold Bonds", 15000000.0, 10.0, "#ec4899"),
                new RbacAnalyticsResponse.AssetAllocationDto("Corporate & Govt Debt", 11000000.0, 7.4, "#06b6d4")
        );

        // Yield vs Benchmark comparison
        response.yieldComparisons = List.of(
                new RbacAnalyticsResponse.YieldComparisonDto("Large Cap Growth Fund", 16.8, 12.4),
                new RbacAnalyticsResponse.YieldComparisonDto("Tech & Digital Index Fund", 22.4, 15.1),
                new RbacAnalyticsResponse.YieldComparisonDto("High-Yield Corporate Bond", 9.2, 7.5),
                new RbacAnalyticsResponse.YieldComparisonDto("FinSync Balanced Advantage", 14.5, 11.2),
                new RbacAnalyticsResponse.YieldComparisonDto("Sovereign Gold Bond 2026", 11.8, 8.9)
        );

        // Regional User Reach Distribution
        response.regionalReach = List.of(
                new RbacAnalyticsResponse.RegionalReachDto("Mumbai Metro Tier-1", 4250, 34.0, "+14.2% QoQ"),
                new RbacAnalyticsResponse.RegionalReachDto("Bengaluru Tech Corridor", 3800, 30.4, "+18.6% QoQ"),
                new RbacAnalyticsResponse.RegionalReachDto("Delhi-NCR Capital Region", 2600, 20.8, "+11.0% QoQ"),
                new RbacAnalyticsResponse.RegionalReachDto("Hyderabad & Chennai Hubs", 1200, 9.6, "+9.4% QoQ"),
                new RbacAnalyticsResponse.RegionalReachDto("Global NRI Accounts", 650, 5.2, "+22.1% QoQ")
        );

        // Monthly User Reach Growth
        response.monthlyUserGrowth = List.of(
                new RbacAnalyticsResponse.UserGrowthDto("Jan", 9200, 840),
                new RbacAnalyticsResponse.UserGrowthDto("Feb", 9950, 750),
                new RbacAnalyticsResponse.UserGrowthDto("Mar", 10700, 750),
                new RbacAnalyticsResponse.UserGrowthDto("Apr", 11600, 900),
                new RbacAnalyticsResponse.UserGrowthDto("May", 12100, 500),
                new RbacAnalyticsResponse.UserGrowthDto("Jun", 12500, 400)
        );

        // Investment Portfolios Table Data
        response.investmentPortfolios = List.of(
                new RbacAnalyticsResponse.InvestmentPortfolioDto("INV-101", "Bluechip Equity Growth", "Equities", "Moderate-High", 45000000.0, 18.4, 1420, "ACTIVE"),
                new RbacAnalyticsResponse.InvestmentPortfolioDto("INV-102", "FinSync Tax Saver ELSS", "Mutual Funds", "Moderate", 32000000.0, 15.2, 2150, "ACTIVE"),
                new RbacAnalyticsResponse.InvestmentPortfolioDto("INV-103", "Senior Citizen Guaranteed Yield", "Fixed Income", "Low", 28000000.0, 8.75, 980, "ACTIVE"),
                new RbacAnalyticsResponse.InvestmentPortfolioDto("INV-104", "Emerging Fintech & AI Fund", "Thematic Equity", "High", 18500000.0, 24.6, 670, "OUTPERFORMING"),
                new RbacAnalyticsResponse.InvestmentPortfolioDto("INV-105", "Green Infrastructure Bond", "ESG Debt", "Very Low", 14000000.0, 7.8, 410, "STABLE")
        );

        // User Directory List
        response.userList = users.stream().map(u -> new RbacAnalyticsResponse.UserSummaryDto(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getRole() != null ? u.getRole().name() : "CUSTOMER",
                u.getPhoneNumber() != null ? u.getPhoneNumber() : "",
                u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""
        )).collect(Collectors.toList());

        // Granular Role Permission Matrix
        response.rolePermissions = List.of(
                new RbacAnalyticsResponse.RolePermissionDto("Personal Dashboard Overview", true, true, true),
                new RbacAnalyticsResponse.RolePermissionDto("Account Balances & Debit Cards", true, true, true),
                new RbacAnalyticsResponse.RolePermissionDto("Funds Transfer & Bill Pay", true, true, true),
                new RbacAnalyticsResponse.RolePermissionDto("Personal Expense Analytics", true, true, true),
                new RbacAnalyticsResponse.RolePermissionDto("Savings Vault Management", true, true, true),
                new RbacAnalyticsResponse.RolePermissionDto("Macro Investment Analysis & Allocation", false, true, true),
                new RbacAnalyticsResponse.RolePermissionDto("Yield Comparison & Portfolio Benchmarks", false, true, true),
                new RbacAnalyticsResponse.RolePermissionDto("Regional User Reach & Demographic Metrics", false, true, true),
                new RbacAnalyticsResponse.RolePermissionDto("Global User Access Directory", false, false, true),
                new RbacAnalyticsResponse.RolePermissionDto("Role Assignment & System Security Controls", false, false, true)
        );

        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> updateUserRole(UserRoleUpdateRequest req) {
        User user = userRepository.findById(req.userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + req.userId));

        user.setRole(req.newRole);
        userRepository.save(user);

        return Map.of(
                "success", true,
                "message", "User role updated successfully",
                "userId", user.getId(),
                "newRole", user.getRole().name()
        );
    }
}
