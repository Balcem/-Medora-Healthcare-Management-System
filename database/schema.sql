-- ============================================================
-- MEDORA Healthcare Management System — Database Schema
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS medora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medora_db;

-- ─────────────────────────────────────────────
-- USERS (base entity for all roles)
-- ─────────────────────────────────────────────
CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    role        ENUM('PATIENT','DOCTOR','ADMIN') NOT NULL DEFAULT 'PATIENT',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active   BOOLEAN DEFAULT TRUE
);

-- ─────────────────────────────────────────────
-- SPECIALTIES
-- ─────────────────────────────────────────────
CREATE TABLE specialties (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- ─────────────────────────────────────────────
-- DOCTORS
-- ─────────────────────────────────────────────
CREATE TABLE doctors (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL UNIQUE,
    specialty_id    BIGINT NOT NULL,
    license_number  VARCHAR(100) NOT NULL UNIQUE,
    bio             TEXT,
    experience_years INT DEFAULT 0,
    consultation_fee DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);

-- ─────────────────────────────────────────────
-- PATIENTS
-- ─────────────────────────────────────────────
CREATE TABLE patients (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL UNIQUE,
    date_of_birth   DATE,
    gender          ENUM('MALE','FEMALE','OTHER'),
    blood_type      ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
    address         VARCHAR(500),
    emergency_contact VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- APPOINTMENTS
-- ─────────────────────────────────────────────
CREATE TABLE appointments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id      BIGINT NOT NULL,
    doctor_id       BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    status          ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
    reason          TEXT,
    notes           TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    -- Prevent double booking: same doctor, same date, overlapping time
    UNIQUE KEY uq_doctor_slot (doctor_id, appointment_date, start_time)
);

-- ─────────────────────────────────────────────
-- MEDICAL RECORDS
-- ─────────────────────────────────────────────
CREATE TABLE medical_records (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id      BIGINT NOT NULL,
    doctor_id       BIGINT NOT NULL,
    appointment_id  BIGINT,
    diagnosis       TEXT NOT NULL,
    prescription    TEXT,
    notes           TEXT,
    visit_date      DATE NOT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────────
INSERT INTO specialties (name, description) VALUES
('Cardiology', 'Heart and cardiovascular system'),
('Neurology', 'Brain and nervous system'),
('Orthopedics', 'Bones, joints, and muscles'),
('Pediatrics', 'Medical care for infants and children'),
('Dermatology', 'Skin conditions and diseases'),
('Oncology', 'Cancer diagnosis and treatment'),
('Psychiatry', 'Mental health disorders'),
('General Practice', 'Primary and preventive care');

-- Admin user (password: Admin@123)
INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES
('System', 'Admin', 'admin@medora.health',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/leyshRaXr9Hv.9/3e', '+1-555-0100', 'ADMIN');

-- Doctor user (password: Doctor@123)
INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES
('Sarah', 'Johnson', 'sarah.johnson@medora.health',
 '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0201', 'DOCTOR'),
('Michael', 'Chen', 'michael.chen@medora.health',
 '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0202', 'DOCTOR');

-- Patient user (password: Patient@123)
INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES
('Emily', 'Davis', 'emily.davis@medora.health',
 '$2a$12$TIk8hBEMKWVCPXfJXFkf.eflnHHzRiL8jVZ8Zfz2QdbMb0yknHAf2', '+1-555-0301', 'PATIENT');

INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee) VALUES
(2, 1, 'MD-CARD-001', 'Board-certified cardiologist with 12 years of experience in interventional cardiology.', 12, 150.00),
(3, 2, 'MD-NEUR-002', 'Neurologist specializing in epilepsy and movement disorders.', 8, 175.00);

INSERT INTO patients (user_id, date_of_birth, gender, blood_type, address, emergency_contact) VALUES
(4, '1990-06-15', 'FEMALE', 'A+', '123 Maple Street, Springfield, IL 62701', 'John Davis +1-555-0400');
