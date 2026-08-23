package com.finsync.controller;

import com.finsync.security.CurrentUser;
import com.finsync.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<?> getMyNotifications() {
        return ResponseEntity.ok(notificationService.getUserNotifications(currentUser.id()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        return ResponseEntity.ok(Map.of("unreadCount", notificationService.getUnreadCount(currentUser.id())));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(currentUser.id(), id));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        notificationService.markAllAsRead(currentUser.id());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(currentUser.id(), id);
        return ResponseEntity.ok(Map.of("message", "Notification deleted successfully"));
    }
}
