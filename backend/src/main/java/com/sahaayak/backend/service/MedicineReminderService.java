package com.sahaayak.backend.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.sahaayak.backend.dto.MedicineReminderRequest;
import com.sahaayak.backend.model.MedicineReminder;
import com.sahaayak.backend.repository.MedicineReminderRepository;

@Service
public class MedicineReminderService {

    private final MedicineReminderRepository repository;

    public MedicineReminderService(MedicineReminderRepository repository) {
        this.repository = repository;
    }

    // Validate frequency
    private String validateAndNormalizeFrequency(String frequency) {

        if (frequency == null || frequency.isBlank()) {
            throw new IllegalArgumentException(
                    "Frequency is required."
            );
        }

        String normalizedFrequency =
                frequency.trim().toUpperCase(Locale.ROOT);

        if (!normalizedFrequency.equals("DAILY")
                && !normalizedFrequency.equals("AS_NEEDED")) {

            throw new IllegalArgumentException(
                    "Frequency must be DAILY or AS_NEEDED."
            );
        }

        return normalizedFrequency;
    }

    // Validate the complete reminder request
    private MedicineReminder buildReminder(
            MedicineReminderRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Reminder details are required."
            );
        }

        if (request.getUserId() == null) {
            throw new IllegalArgumentException(
                    "User ID is required."
            );
        }

        if (request.getMedicineName() == null
                || request.getMedicineName().isBlank()) {
            throw new IllegalArgumentException(
                    "Medicine name is required."
            );
        }

        if (request.getDosage() == null
                || request.getDosage().isBlank()) {
            throw new IllegalArgumentException(
                    "Medicine dosage is required."
            );
        }

        String frequency =
                validateAndNormalizeFrequency(request.getFrequency());

        if (frequency.equals("DAILY")
                && request.getReminderTime() == null) {

            throw new IllegalArgumentException(
                    "Reminder time is required for DAILY reminders."
            );
        }

        MedicineReminder reminder = new MedicineReminder();

        reminder.setUserId(request.getUserId());
        reminder.setMedicineName(request.getMedicineName().trim());
        reminder.setDosage(request.getDosage().trim());
        reminder.setFrequency(frequency);

        // DAILY reminders require a time.
        // AS_NEEDED reminders do not have a scheduled time.
        if (frequency.equals("DAILY")) {
            reminder.setReminderTime(request.getReminderTime());
        } else {
            reminder.setReminderTime(null);
        }

        return reminder;
    }

    // CREATE reminder
    public MedicineReminder createReminder(
            MedicineReminderRequest request) {

        MedicineReminder reminder = buildReminder(request);

        reminder.setStatus("ACTIVE");

        return repository.save(reminder);
    }

    // GET reminders by user ID
    public List<MedicineReminder> getRemindersByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    // GET reminder by ID
    public MedicineReminder getReminderById(Long id) {
        return repository.findById(id);
    }

    // UPDATE reminder
    public MedicineReminder updateReminder(
            Long id,
            MedicineReminderRequest request) {

        MedicineReminder reminder = buildReminder(request);

        reminder.setId(id);

        boolean updated = repository.update(reminder);

        return updated ? repository.findById(id) : null;
    }

    // ACTIVATE OR DEACTIVATE reminder
    public boolean updateStatus(Long id, String status) {
        return repository.updateStatus(id, status);
    }

    // DELETE reminder
    public boolean deleteReminder(Long id) {
        return repository.delete(id);
    }
}
