package com.finsync.config;

import com.finsync.model.*;
import com.finsync.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize default system settings
        initSystemSettings();

        // 2. Ensure accounts, transactions & sample data exist
        List<User> users = userRepository.findAll();
        for (int i = 0; i < users.size(); i++) {
            User u = users.get(i);
            boolean userUpdated = false;
            if (u.getKycStatus() == null) {
                u.setKycStatus("VERIFIED");
                userUpdated = true;
            }
            if (u.getPublicPaymentId() == null || u.getPublicPaymentId().trim().isEmpty()) {
                u.setPublicPaymentId(generateUniquePaymentId());
                userUpdated = true;
            }
            if (userUpdated) {
                userRepository.save(u);
            }

            List<Account> existing = accountRepository.findByUserId(u.getId());
            if (existing.isEmpty()) {
                // Generate distinct, realistic opening balances per user
                BigDecimal initialBalance = new BigDecimal(5000 + (i * 3500));

                Account acc = new Account();
                acc.setAccountNumber(generateUniqueAccountNumber());
                acc.setUser(u);
                acc.setAccountType(i % 3 == 0 ? AccountType.CURRENT : AccountType.SAVINGS);
                acc.setBalance(initialBalance);
                acc.setPrimary(true);
                acc.setStatus("ACTIVE");
                acc.setCardFrozen(false);
                acc.setOnlineTxnEnabled(true);
                acc.setContactlessEnabled(true);
                acc.setInternationalTxnEnabled(false);
                acc.setDailyLimit(new BigDecimal("50000.00"));
                acc.setCreatedAt(LocalDateTime.now().minusDays(10 + i));
                acc = accountRepository.save(acc);

                Transaction txn = new Transaction();
                txn.setAccount(acc);
                txn.setType(TransactionType.DEPOSIT);
                txn.setAmount(initialBalance);
                txn.setBalanceAfter(initialBalance);
                txn.setDescription("Primary Account Opening Deposit");
                txn.setStatus("SUCCESS");
                txn.setRiskLevel("LOW");
                transactionRepository.save(txn);

                // Sample welcome notification
                Notification notif = new Notification();
                notif.setUser(u);
                notif.setTitle("Welcome to FinSync Bank");
                notif.setMessage("Your " + acc.getAccountType() + " account (" + acc.getAccountNumber() + ") is activated.");
                notif.setType("SYSTEM");
                notif.setRead(false);
                notificationRepository.save(notif);

                // Sample audit log
                AuditLog log = new AuditLog();
                log.setPerformedBy(u.getFullName());
                log.setUserEmail(u.getEmail());
                log.setAccountNumber(acc.getAccountNumber());
                log.setAction("ACCOUNT_OPENED");
                log.setDescription("Initial bank account opened with balance ₹" + initialBalance);
                log.setAmount(initialBalance);
                log.setStatus("SUCCESS");
                log.setRiskLevel("LOW");
                auditLogRepository.save(log);
            } else {
                Account firstAcc = existing.get(0);
                boolean updated = false;
                if (!firstAcc.isPrimary()) {
                    firstAcc.setPrimary(true);
                    updated = true;
                }
                if (firstAcc.getStatus() == null) {
                    firstAcc.setStatus("ACTIVE");
                    updated = true;
                }
                if (firstAcc.getDailyLimit() == null) {
                    firstAcc.setDailyLimit(new BigDecimal("50000.00"));
                    updated = true;
                }
                if (updated) {
                    accountRepository.save(firstAcc);
                }
            }

            // Seed sample beneficiary if none exists for this customer
            if (u.getRole() == Role.CUSTOMER && beneficiaryRepository.findByUserIdOrderByCreatedAtDesc(u.getId()).isEmpty()) {
                Beneficiary b1 = new Beneficiary();
                b1.setUser(u);
                b1.setName("Aditi Sharma");
                b1.setBankName("State Bank of India");
                b1.setAccountNumber("FS4992820634");
                b1.setIfsc("SBIN0004123");
                b1.setStatus("ACTIVE");
                beneficiaryRepository.save(b1);

                Beneficiary b2 = new Beneficiary();
                b2.setUser(u);
                b2.setName("Vikram Malhotra");
                b2.setBankName("HDFC Bank");
                b2.setAccountNumber("FS4992829910");
                b2.setIfsc("HDFC0001844");
                b2.setStatus("ACTIVE");
                beneficiaryRepository.save(b2);
            }
        }
    }

    private void initSystemSettings() {
        createSettingIfAbsent("max_transaction_limit", "500000.00", "Maximum allowable transaction amount");
        createSettingIfAbsent("account_creation_enabled", "true", "Flag to enable/disable account creation");
        createSettingIfAbsent("maintenance_mode", "false", "System maintenance mode flag");
        createSettingIfAbsent("notifications_enabled", "true", "Enable/disable real-time notification alerts");
        createSettingIfAbsent("audit_logging_enabled", "true", "Enable/disable comprehensive transaction audit logging");
    }

    private void createSettingIfAbsent(String key, String value, String desc) {
        if (systemSettingRepository.findBySettingKey(key).isEmpty()) {
            systemSettingRepository.save(new SystemSetting(key, value, desc));
        }
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            long randomDigits = (long) (RANDOM.nextDouble() * 1_0000_000_000L);
            accountNumber = "FS" + String.format("%010d", randomDigits);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    private String generateUniquePaymentId() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        String payId;
        do {
            StringBuilder sb = new StringBuilder("FS-PAY-");
            for (int i = 0; i < 6; i++) {
                sb.append(chars.charAt(RANDOM.nextInt(chars.length())));
            }
            payId = sb.toString();
        } while (userRepository.existsByPublicPaymentId(payId));
        return payId;
    }
}
