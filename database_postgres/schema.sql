-- ============================================
-- SAHAYAAK DATABASE SCHEMA
-- PostgreSQL
-- ============================================

-- ============================================
-- USERS
-- Stores the Sahaayak user
-- ============================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE
);


-- ============================================
-- CONTACTS
-- Stores family members, doctors, etc.
-- ============================================

CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_contacts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================
-- MEDICINE REMINDERS
-- Stores medicine reminders
-- ============================================

CREATE TABLE medicine_reminders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    reminder_time TIME NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_medicine_reminders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_medicine_status
        CHECK (status IN ('ACTIVE', 'INACTIVE'))
);


-- ============================================
-- MEMORIES
-- Stores the user's memories
-- ============================================

CREATE TABLE memories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    memory_date DATE,
    image_url TEXT,

    CONSTRAINT fk_memories_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
