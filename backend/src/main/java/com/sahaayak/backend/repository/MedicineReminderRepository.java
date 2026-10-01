package com.sahaayak.backend.repository;

import java.sql.Time;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.sahaayak.backend.model.MedicineReminder;

@Repository
public class MedicineReminderRepository {

    private final JdbcTemplate jdbcTemplate;

    public MedicineReminderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<MedicineReminder> rowMapper = (rs, rowNum) -> {

        Time time = rs.getTime("reminder_time");

        return new MedicineReminder(
                rs.getLong("id"),
                rs.getLong("user_id"),
                rs.getString("medicine_name"),
                rs.getString("dosage"),
                time != null ? time.toLocalTime() : null,
                rs.getString("frequency"),
                rs.getString("status"));
    };

    public MedicineReminder save(MedicineReminder reminder) {

        String sql = """
                INSERT INTO medicine_reminders
                (user_id, medicine_name, dosage, reminder_time, frequency, status)
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING id
                """;

        Long id = jdbcTemplate.queryForObject(
                sql,
                Long.class,
                reminder.getUserId(),
                reminder.getMedicineName(),
                reminder.getDosage(),
                reminder.getReminderTime(),
                reminder.getFrequency(),
                reminder.getStatus());

        reminder.setId(id);

        return reminder;
    }

    public List<MedicineReminder> findByUserId(Long userId) {

        String sql = """
                SELECT id, user_id, medicine_name, dosage,
                       reminder_time, frequency, status
                FROM medicine_reminders
                WHERE user_id = ?
                ORDER BY reminder_time
                """;

        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public MedicineReminder findById(Long id) {

        String sql = """
                SELECT id, user_id, medicine_name, dosage,
                       reminder_time, frequency, status
                FROM medicine_reminders
                WHERE id = ?
                """;

        List<MedicineReminder> results = jdbcTemplate.query(sql, rowMapper, id);

        return results.isEmpty() ? null : results.get(0);
    }

    public boolean update(MedicineReminder reminder) {
        String sql = """
                UPDATE medicine_reminders
                SET medicine_name = ?, dosage = ?, reminder_time = ?, frequency = ?
                WHERE id = ? AND user_id = ?
                """;

        return jdbcTemplate.update(
                sql,
                reminder.getMedicineName(),
                reminder.getDosage(),
                reminder.getReminderTime(),
                reminder.getFrequency(),
                reminder.getId(),
                reminder.getUserId()) > 0;
    }

    public boolean updateStatus(Long id, String status) {

        String sql = """
                UPDATE medicine_reminders
                SET status = ?
                WHERE id = ?
                """;

        return jdbcTemplate.update(sql, status, id) > 0;
    }

    public boolean delete(Long id) {

        String sql = """
                DELETE FROM medicine_reminders
                WHERE id = ?
                """;

        return jdbcTemplate.update(sql, id) > 0;
    }
}