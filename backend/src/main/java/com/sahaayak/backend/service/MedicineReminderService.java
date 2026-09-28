package com.sahaayak.backend.service;

import com.sahaayak.backend.dto.MedicineReminderRequest;
import com.sahaayak.backend.model.MedicineReminder;
import com.sahaayak.backend.repository.MedicineReminderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineReminderService {

    private final MedicineReminderRepository repository;

    public MedicineReminderService(MedicineReminderRepository repository) {
        this.repository = repository;
    }

    public MedicineReminder createReminder(
            MedicineReminderRequest request) {

        MedicineReminder reminder = new MedicineReminder();

        reminder.setUserId(request.getUserId());
        reminder.setMedicineName(request.getMedicineName());
        reminder.setDosage(request.getDosage());
        reminder.setReminderTime(request.getReminderTime());
        reminder.setFrequency(request.getFrequency());

        reminder.setStatus("ACTIVE");

        return repository.save(reminder);
    }

    public List<MedicineReminder> getRemindersByUserId(Long userId) {

        return repository.findByUserId(userId);
    }

    public MedicineReminder getReminderById(Long id) {

        return repository.findById(id);
    }

    public boolean updateStatus(Long id, String status) {

        return repository.updateStatus(id, status);
    }

    public boolean deleteReminder(Long id) {

        return repository.delete(id);
    }
}