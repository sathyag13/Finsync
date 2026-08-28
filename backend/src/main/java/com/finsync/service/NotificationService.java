package com.finsync.service;

import com.finsync.model.Notification;
import com.finsync.model.User;

import java.util.List;
import java.util.Map;

public interface NotificationService {
    Notification sendNotification(User user, String title, String message, String type);
    Notification sendNotification(Long userId, String title, String message, String type);
    void sendNotificationToAdmins(String title, String message, String type);
    List<Map<String, Object>> getUserNotifications(Long userId);
    Map<String, Object> markAsRead(Long userId, Long notificationId);
    void markAllAsRead(Long userId);
    void deleteNotification(Long userId, Long notificationId);
    long getUnreadCount(Long userId);
}
