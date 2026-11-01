package com.sahaayak.backend.controller;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sahaayak.backend.dto.MedicineReminderRequest;
import com.sahaayak.backend.model.MedicineReminder;
import com.sahaayak.backend.service.MedicineReminderService;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "*")
public class MedicineReminderController {

    private final MedicineReminderService service;

    public MedicineReminderController(MedicineReminderService service) {
        this.service = service;
    }

    // CREATE reminder
    @PostMapping
    public ResponseEntity<MedicineReminder> createReminder(
            @RequestBody MedicineReminderRequest request) {

        MedicineReminder reminder = service.createReminder(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reminder);
    }

    // GET all reminders for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MedicineReminder>> getReminders(
            @PathVariable Long userId) {

        List<MedicineReminder> reminders =
                service.getRemindersByUserId(userId);

        return ResponseEntity.ok(reminders);
    }

    // GET reminder by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getReminder(
            @PathVariable Long id) {

        MedicineReminder reminder = service.getReminderById(id);

        if (reminder == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            "Medicine reminder not found"
                    ));
        }

        return ResponseEntity.ok(reminder);
    }

    // UPDATE reminder
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReminder(
            @PathVariable Long id,
            @RequestBody MedicineReminderRequest request) {

        MedicineReminder updated =
                service.updateReminder(id, request);

        if (updated == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            "Medicine reminder not found"
                    ));
        }

        return ResponseEntity.ok(updated);
    }

    // ACTIVATE OR DEACTIVATE reminder
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String status = request.get("status");

        if (status != null) {
            status = status.trim().toUpperCase(Locale.ROOT);
        }

        if (status == null
                || !(status.equals("ACTIVE")
                || status.equals("INACTIVE"))) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            "Status must be ACTIVE or INACTIVE"
                    ));
        }

        boolean updated = service.updateStatus(id, status);

        if (!updated) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            "Medicine reminder not found"
                    ));
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Reminder status updated successfully"
                )
        );
    }

    // DELETE reminder
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReminder(
            @PathVariable Long id) {

        boolean deleted = service.deleteReminder(id);

        if (!deleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            "Medicine reminder not found"
                    ));
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Medicine reminder deleted successfully"
                )
        );
    }

    // HANDLE INVALID REMINDER REQUESTS
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleValidationError(
            IllegalArgumentException exception) {

        return ResponseEntity
                .badRequest()
                .body(Map.of(
                        "error",
                        exception.getMessage()
                ));
    }
}
