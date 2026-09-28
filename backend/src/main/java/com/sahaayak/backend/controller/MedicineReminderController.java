package com.sahaayak.backend.controller;

import com.sahaayak.backend.dto.MedicineReminderRequest;
import com.sahaayak.backend.model.MedicineReminder;
import com.sahaayak.backend.service.MedicineReminderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "*")
public class MedicineReminderController {

    private final MedicineReminderService service;

    public MedicineReminderController(
            MedicineReminderService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MedicineReminder> createReminder(
            @RequestBody MedicineReminderRequest request) {

        MedicineReminder reminder = service.createReminder(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reminder);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MedicineReminder>> getReminders(
            @PathVariable Long userId) {

        List<MedicineReminder> reminders = service.getRemindersByUserId(userId);

        return ResponseEntity.ok(reminders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReminder(
            @PathVariable Long id) {

        MedicineReminder reminder = service.getReminderById(id);

        if (reminder == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            "Medicine reminder not found"));
        }

        return ResponseEntity.ok(reminder);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String status = request.get("status");

        if (status == null ||
                !(status.equals("pending")
                        || status.equals("taken")
                        || status.equals("skipped"))) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            "Status must be pending, taken, or skipped"));
        }

        boolean updated = service.updateStatus(id, status);

        if (!updated) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            "Medicine reminder not found"));
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Reminder status updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReminder(
            @PathVariable Long id) {

        boolean deleted = service.deleteReminder(id);

        if (!deleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            "Medicine reminder not found"));
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Medicine reminder deleted successfully"));
    }
}