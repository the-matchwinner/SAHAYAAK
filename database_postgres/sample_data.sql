-- ============================================
-- SAHAYAAK SAMPLE DATA
-- ============================================

-- Users
INSERT INTO users (name, phone, email)
VALUES
    ('Asha', '9876543210', 'asha@gmail.com');

-- Contacts
INSERT INTO contacts
    (user_id, name, relationship, phone, is_emergency)
VALUES
    (1, 'Rahul', 'Son', '9876543211', TRUE),
    (1, 'Priya', 'Daughter', '9876543212', FALSE),
    (1, 'Dr. Rao', 'Doctor', '9876543213', TRUE);

-- Medicine reminders
INSERT INTO medicine_reminders
    (user_id, medicine_name, dosage, reminder_time, frequency, status)
VALUES
    (1, 'Amlodipine', '1 tablet', '09:30', 'DAILY', 'ACTIVE'),
    (1, 'Vitamin D', '1 tablet', '20:00', 'WEEKLY', 'ACTIVE');

-- Memories
INSERT INTO memories
    (user_id, title, description, memory_date, image_url)
VALUES
    (
        1,
        'Family Trip',
        'Trip to Goa with family',
        '2026-08-15',
        'https://example.com/images/family-trip.jpg'
    ),
    (
        1,
        'Birthday Celebration',
        'Family birthday celebration',
        '2026-07-20',
        'https://example.com/images/birthday.jpg'
    );
