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

    @RequestMapping(value = "/{id}/read", method = {RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(currentUser.id(), id));
    }

    @RequestMapping(value = "/read-all", method = {RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<?> markAllAsRead() {
        notificationService.markAllAsRead(currentUser.id());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @DeleteMapping("/clear-all")
    public ResponseEntity<?> clearAllNotifications() {
        notificationService.deleteAllNotifications(currentUser.id());
        return ResponseEntity.ok(Map.of("message", "All notifications deleted successfully"));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAll() {
        notificationService.deleteAllNotifications(currentUser.id());
        return ResponseEntity.ok(Map.of("message", "All notifications deleted successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(currentUser.id(), id);
        return ResponseEntity.ok(Map.of("message", "Notification deleted successfully"));
    }

}
