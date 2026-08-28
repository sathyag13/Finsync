package com.finsync.service.impl;

import com.finsync.exception.ResourceNotFoundException;
import com.finsync.model.Notification;
import com.finsync.model.User;
import com.finsync.repository.NotificationRepository;
import com.finsync.repository.SystemSettingRepository;
import com.finsync.repository.UserRepository;
import com.finsync.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SystemSettingRepository systemSettingRepository;

    private boolean isNotificationsEnabled() {
        return systemSettingRepository.findBySettingKey("notifications_enabled")
                .map(s -> !"false".equalsIgnoreCase(s.getSettingValue()))
                .orElse(true);
    }

    @Override
    @Transactional
    public Notification sendNotification(User user, String title, String message, String type) {
        if (user == null || !isNotificationsEnabled()) return null;
        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type != null ? type : "SYSTEM");
        n.setRead(false);
        return notificationRepository.save(n);
    }

    @Override
    @Transactional
    public Notification sendNotification(Long userId, String title, String message, String type) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;
        return sendNotification(user, title, message, type);
    }

    @Override
    @Transactional
    public void sendNotificationToAdmins(String title, String message, String type) {
        if (!isNotificationsEnabled()) return;
        List<User> admins = userRepository.findByRole(com.finsync.model.Role.ADMIN);
        for (User admin : admins) {
            Notification n = new Notification();
            n.setUser(admin);
            n.setTitle(title);
            n.setMessage(message);
            n.setType(type != null ? type : "ADMIN_SYSTEM");
            n.setRead(false);
            notificationRepository.save(n);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUserNotifications(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return list.stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> markAsRead(Long userId, Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!n.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification does not belong to user");
        }
        n.setRead(true);
        notificationRepository.save(n);
        return toMap(n);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    @Override
    @Transactional
    public void deleteNotification(Long userId, Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!n.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification does not belong to user");
        }
        notificationRepository.delete(n);
    }

    @Override
    @Transactional
    public void deleteAllNotifications(Long userId) {
        notificationRepository.deleteAllByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    private Map<String, Object> toMap(Notification n) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", n.getId());
        map.put("title", n.getTitle());
        map.put("message", n.getMessage());
        map.put("type", n.getType());
        map.put("isRead", n.isRead());
        map.put("read", n.isRead());
        map.put("createdAt", n.getCreatedAt());
        return map;
    }
}
