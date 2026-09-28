package com.sahaayak.backend.model;

import java.time.LocalTime;

public class MedicineReminder {

    private Long id;
    private Long userId;
    private String medicineName;
    private String dosage;
    private LocalTime reminderTime;
    private String frequency;
    private String status;

    public MedicineReminder() {
    }

    public MedicineReminder(Long id, Long userId, String medicineName,
            String dosage, LocalTime reminderTime,
            String frequency, String status) {
        this.id = id;
        this.userId = userId;
        this.medicineName = medicineName;
        this.dosage = dosage;
        this.reminderTime = reminderTime;
        this.frequency = frequency;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public LocalTime getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(LocalTime reminderTime) {
        this.reminderTime = reminderTime;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}