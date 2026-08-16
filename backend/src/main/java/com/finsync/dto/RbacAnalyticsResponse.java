package com.finsync.dto;

import java.util.List;
import java.util.Map;

public class RbacAnalyticsResponse {
    public long totalUsers;
    public long totalAccounts;
    public long customerCount;
    public long analystCount;
    public long adminCount;
    public double totalAssetsUnderManagement;
    public double totalTransactionsVolume;

    public Map<String, Long> timePeriodReach;
    public List<FrequentTransactorDto> frequentTransactors;
    public List<CurrencyDepositDto> currencyDeposits;

    public List<AssetAllocationDto> assetAllocations;
    public List<YieldComparisonDto> yieldComparisons;
    public List<RegionalReachDto> regionalReach;
    public List<UserGrowthDto> monthlyUserGrowth;
    public List<InvestmentPortfolioDto> investmentPortfolios;
    public List<UserSummaryDto> userList;
    public List<RolePermissionDto> rolePermissions;

    public static class FrequentTransactorDto {
        public Long userId;
        public String fullName;
        public String email;
        public String accountNumber;
        public int transactionCount;
        public double totalVolume;
        public String primaryType;
        public String tierBadge;

        public FrequentTransactorDto(Long userId, String fullName, String email, String accountNumber, int transactionCount, double totalVolume, String primaryType, String tierBadge) {
            this.userId = userId;
            this.fullName = fullName;
            this.email = email;
            this.accountNumber = accountNumber;
            this.transactionCount = transactionCount;
            this.totalVolume = totalVolume;
            this.primaryType = primaryType;
            this.tierBadge = tierBadge;
        }
    }

    public static class CurrencyDepositDto {
        public String currencyCode;
        public String currencyName;
        public String symbol;
        public double totalAmount;
        public double percentageShare;
        public double inrEquivalent;

        public CurrencyDepositDto(String currencyCode, String currencyName, String symbol, double totalAmount, double percentageShare, double inrEquivalent) {
            this.currencyCode = currencyCode;
            this.currencyName = currencyName;
            this.symbol = symbol;
            this.totalAmount = totalAmount;
            this.percentageShare = percentageShare;
            this.inrEquivalent = inrEquivalent;
        }
    }

    public static class AssetAllocationDto {
        public String category;
        public double totalValue;
        public double percentage;
        public String color;

        public AssetAllocationDto(String category, double totalValue, double percentage, String color) {
            this.category = category;
            this.totalValue = totalValue;
            this.percentage = percentage;
            this.color = color;
        }
    }

    public static class YieldComparisonDto {
        public String assetName;
        public double cagrPercentage;
        public double benchmarkPercentage;

        public YieldComparisonDto(String assetName, double cagrPercentage, double benchmarkPercentage) {
            this.assetName = assetName;
            this.cagrPercentage = cagrPercentage;
            this.benchmarkPercentage = benchmarkPercentage;
        }
    }

    public static class RegionalReachDto {
        public String region;
        public long activeUsers;
        public double marketSharePercentage;
        public String trend;

        public RegionalReachDto(String region, long activeUsers, double marketSharePercentage, String trend) {
            this.region = region;
            this.activeUsers = activeUsers;
            this.marketSharePercentage = marketSharePercentage;
            this.trend = trend;
        }
    }

    public static class UserGrowthDto {
        public String month;
        public long totalUsers;
        public long newRegistrations;

        public UserGrowthDto(String month, long totalUsers, long newRegistrations) {
            this.month = month;
            this.totalUsers = totalUsers;
            this.newRegistrations = newRegistrations;
        }
    }

    public static class InvestmentPortfolioDto {
        public String id;
        public String name;
        public String category;
        public String riskRating;
        public double capitalInvested;
        public double returnPercentage;
        public int investorCount;
        public String status;

        public InvestmentPortfolioDto(String id, String name, String category, String riskRating, double capitalInvested, double returnPercentage, int investorCount, String status) {
            this.id = id;
            this.name = name;
            this.category = category;
            this.riskRating = riskRating;
            this.capitalInvested = capitalInvested;
            this.returnPercentage = returnPercentage;
            this.investorCount = investorCount;
            this.status = status;
        }
    }

    public static class UserSummaryDto {
        public Long id;
        public String fullName;
        public String email;
        public String role;
        public String phoneNumber;
        public String createdAt;

        public UserSummaryDto(Long id, String fullName, String email, String role, String phoneNumber, String createdAt) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
            this.phoneNumber = phoneNumber;
            this.createdAt = createdAt;
        }
    }

    public static class RolePermissionDto {
        public String module;
        public boolean customer;
        public boolean analyst;
        public boolean admin;

        public RolePermissionDto(String module, boolean customer, boolean analyst, boolean admin) {
            this.module = module;
            this.customer = customer;
            this.analyst = analyst;
            this.admin = admin;
        }
    }
}
