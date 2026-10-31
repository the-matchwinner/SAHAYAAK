
package com.sahaayak.backend.service;

import java.time.DayOfWeek;
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

    private String validateAndNormalizeFrequency(
            MedicineReminderRequest request) {

        if (request.getFrequency() == null
                || request.getFrequency().isBlank()) {
            throw new IllegalArgumentException(
                    "Frequency is required.");
        }

        String frequency = request.getFrequency()
                .trim()
                .toUpperCase(Locale.ROOT);

        if (!frequency.equals("DAILY")
                && !frequency.equals("WEEKLY")) {
            throw new IllegalArgumentException(
                    "Frequency must be DAILY or WEEKLY.");
        }

        return frequency;
    }

    private String validateAndNormalizeDayOfWeek(
            String frequency, String dayOfWeek) {

        if (frequency.equals("DAILY")) {
            return null;
        }

        if (dayOfWeek == null || dayOfWeek.isBlank()) {
            throw new IllegalArgumentException(
                    "Day of week is required for WEEKLY reminders.");
        }

        try {
            return DayOfWeek.valueOf(
                    dayOfWeek.trim().toUpperCase(Locale.ROOT))
                    .name();
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "Invalid day. Use MONDAY, TUESDAY, WEDNESDAY, "
                    + "THURSDAY, FRIDAY, SATURDAY or SUNDAY.");
        }
    }

    public MedicineReminder createReminder(
            MedicineReminderRequest request) {

        String frequency =
                validateAndNormalizeFrequency(request);

        String dayOfWeek =
                validateAndNormalizeDayOfWeek(
                        frequency, request.getDayOfWeek());

        MedicineReminder reminder = new MedicineReminder();

        reminder.setUserId(request.getUserId());
        reminder.setMedicineName(request.getMedicineName());
        reminder.setDosage(request.getDosage());
        reminder.setReminderTime(request.getReminderTime());
        reminder.setFrequency(frequency);
        reminder.setDayOfWeek(dayOfWeek);
        reminder.setStatus("ACTIVE");

        return repository.save(reminder);
    }

    public List<MedicineReminder> getRemindersByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    public MedicineReminder getReminderById(Long id) {
        return repository.findById(id);
    }

    public MedicineReminder updateReminder(
            Long id, MedicineReminderRequest request) {

        String frequency =
                validateAndNormalizeFrequency(request);

        String dayOfWeek =
                validateAndNormalizeDayOfWeek(
                        frequency, request.getDayOfWeek());

        MedicineReminder reminder = new MedicineReminder();

        reminder.setId(id);
        reminder.setUserId(request.getUserId());
        reminder.setMedicineName(request.getMedicineName());
        reminder.setDosage(request.getDosage());
        reminder.setReminderTime(request.getReminderTime());
        reminder.setFrequency(frequency);
        reminder.setDayOfWeek(dayOfWeek);

        return repository.update(reminder)
                ? repository.findById(id)
                : null;
    }

    public boolean updateStatus(Long id, String status) {
        return repository.updateStatus(id, status);
    }

    public boolean deleteReminder(Long id) {
        return repository.delete(id);
    }
}
