# 🏥 Medora — Healthcare Management System

<p align="center">
  <img src="docs/medora-logo.svg" alt="Medora Logo" width="220" />
</p>

<p align="center">
  <strong>A full-stack, production-grade healthcare management platform</strong><br/>
  Spring Boot · React · MySQL · JWT
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.3-brightgreen?style=flat-square&logo=springboot" />
  <img src="https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql" />
  <img src="https://img.shields.io/badge/JWT-Auth-yellow?style=flat-square" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Sample Credentials](#sample-credentials)
- [Logo and Branding](#logo-and-branding)

---

## Overview

**Medora** is a comprehensive healthcare management system that digitises hospital workflows across three user roles:

| Role | Key Capabilities |
|------|-----------------|
| **Patient** | Register, browse doctors, book appointments, view full medical history |
| **Doctor** | Manage schedule, confirm/complete appointments, write diagnoses and prescriptions |
| **Admin** | Full user management, onboard doctors, system-wide analytics dashboard |

---

## Features

### Authentication and Security
- Stateless JWT authentication (Bearer token)
- Role-based access control — PATIENT, DOCTOR, ADMIN
- Passwords hashed with BCrypt (strength 12)
- Global exception handling with meaningful HTTP status codes
- Input validation on all request bodies

### Appointment System
- Time-slot booking (configurable slots, e.g. 30-minute increments 08:00–18:00)
- **Double-booking prevention** — overlapping slots for the same doctor are rejected with `409 Conflict`
- Status lifecycle: `PENDING → CONFIRMED → COMPLETED` or `CANCELLED`
- Patients can cancel their own pending/confirmed appointments
- Doctors can confirm, complete, or cancel any appointment with optional notes

### Medical Records
- Doctors create diagnosis + prescription entries after each visit
- Records optionally linked to a specific appointment
- Patients have read-only access to their complete history
- Expandable accordion UI for at-a-glance and detail views

### Dashboards
- **Patient Dashboard**: upcoming appointments widget, recent records, quick-book CTA
- **Doctor Dashboard**: today's schedule, pending-action list, patient count stats
- **Admin Dashboard**: key metrics, today's appointment total, quick-nav to every admin section

### Analytics (Admin)
- Total users, total doctors, total patients, total appointments, today's count

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 21 LTS | Runtime |
| Spring Boot | 3.3.x | Framework |
| Spring Security | 6.x | Auth and RBAC |
| Spring Data JPA | 3.x | ORM layer |
| Hibernate | 6.x | JPA provider |
| MySQL Connector/J | 8.x | Database driver |
| JJWT | 0.12.5 | JWT creation and validation |
| Lombok | latest | Boilerplate reduction |
| ModelMapper | 3.2 | DTO mapping |
| Maven | 3.9+ | Build tool |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| React Router DOM | 6.x | Client-side routing |
| Axios | 1.7.x | HTTP client |
| date-fns | 3.x | Date formatting utilities |
| Sora + DM Sans | — | Brand typography (Google Fonts) |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│         React Frontend  :3000                │
│  Auth · Patient · Doctor · Admin pages       │
└──────────────────┬──────────────────────────┘
                   │  Axios + JWT Bearer token
┌──────────────────▼──────────────────────────┐
│         Spring Boot API  :8080               │
│                                              │
│  JWT Filter → Controllers → Services         │
│                          ↓                   │
│               JPA Repositories               │
└──────────────────┬──────────────────────────┘
                   │  JDBC / Hibernate
┌──────────────────▼──────────────────────────┐
│              MySQL 8.0                        │
│  users · patients · doctors · appointments   │
│  medical_records · specialties               │
└──────────────────────────────────────────────┘
```

---

## Project Structure

```
medora/
├── README.md
├── docs/
│   └── medora-logo.svg
├── database/
│   └── schema.sql                      ← Run this first
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── resources/
│       │   └── application.properties
│       └── java/com/medora/
│           ├── MedoraApplication.java
│           ├── config/
│           │   ├── AppConfig.java          (ModelMapper bean)
│           │   └── SecurityConfig.java     (CORS + JWT filter chain)
│           ├── controller/
│           │   ├── AuthController.java
│           │   ├── DoctorController.java
│           │   ├── AppointmentController.java
│           │   ├── MedicalRecordController.java
│           │   └── AdminController.java
│           ├── service/
│           │   ├── AuthService.java
│           │   ├── DoctorService.java
│           │   ├── AppointmentService.java   (double-booking logic)
│           │   ├── MedicalRecordService.java
│           │   └── AdminService.java
│           ├── repository/               (Spring Data JPA interfaces)
│           ├── model/                    (JPA entities)
│           ├── dto/                      (request/response DTOs)
│           ├── security/
│           │   ├── JwtUtil.java
│           │   ├── JwtAuthFilter.java
│           │   └── UserDetailsServiceImpl.java
│           └── exception/
│               ├── GlobalExceptionHandler.java
│               ├── ResourceNotFoundException.java
│               ├── ConflictException.java
│               └── BadRequestException.java
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                  (routes + ProtectedRoute wrapper)
        ├── index.js / index.css    (entry point + full design system)
        ├── assets/
        │   └── MedoraLogo.js       (SVG logo React component)
        ├── services/
        │   └── api.js              (Axios instance + all API calls)
        ├── utils/
        │   └── AuthContext.js      (login / logout / register state)
        ├── components/layout/
        │   └── Sidebar.js
        └── pages/
            ├── auth/      LoginPage.js · RegisterPage.js
            ├── patient/   PatientDashboard · FindDoctors · MyAppointments · MedicalHistory
            ├── doctor/    DoctorDashboard · DoctorSchedule · DoctorPatients · DoctorRecords
            └── admin/     AdminDashboard · AdminUsers · AdminDoctors · AdminAppointments
```

---

## Database Design

```
users          (id, first_name, last_name, email, password, phone, role, is_active)
  │
  ├── patients (id, user_id FK, date_of_birth, gender, blood_type, address, emergency_contact)
  │
  └── doctors  (id, user_id FK, specialty_id FK, license_number, bio,
                experience_years, consultation_fee)

specialties    (id, name, description)

appointments   (id, patient_id FK, doctor_id FK, appointment_date,
                start_time, end_time, status, reason, notes)
               UNIQUE KEY (doctor_id, appointment_date, start_time)

medical_records (id, patient_id FK, doctor_id FK, appointment_id FK,
                 diagnosis, prescription, notes, visit_date)
```

The `UNIQUE KEY` on appointments prevents the same doctor from being double-booked at the same start time. The service layer adds a secondary JPQL overlap query to also catch cases where the requested slot overlaps mid-way through an existing booking.

---

## Prerequisites

| Tool | Minimum Version | Download |
|------|----------------|---------|
| Java JDK | 21 | https://adoptium.net |
| Apache Maven | 3.9 | https://maven.apache.org |
| MySQL Server | 8.0 | https://dev.mysql.com/downloads |
| Node.js | 18 | https://nodejs.org |
| npm | 9 | bundled with Node.js |

---

## Setup Instructions

### Step 1 — Extract the project

```bash
unzip medora-healthcare-system.zip
cd medora
```

### Step 2 — Create the database

```bash
mysql -u root -p < database/schema.sql
```

Or open any MySQL client (Workbench, DBeaver, TablePlus) and run the contents of `database/schema.sql`.

This creates `medora_db`, all six tables, and inserts seed data including the demo accounts below.

### Step 3 — Configure the backend

Open `backend/src/main/resources/application.properties` and set your MySQL password:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medora_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```

Everything else — JWT secret, port, CORS origin — is ready for local development as-is.

### Step 4 — Build and run the backend

```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

You should see:

```
Tomcat started on port(s): 8080 (http)
Started MedoraApplication in ~4 seconds
```

### Step 5 — Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The browser opens automatically at **http://localhost:3000**

---

## Running the App

With both servers running:

1. Navigate to **http://localhost:3000**
2. Click one of the **demo account buttons** on the login screen, or register a new patient account
3. Explore the role-appropriate dashboard

**Recommended demo walkthrough:**

1. Log in as **Patient** → browse doctors → book an appointment
2. Log in as **Doctor** → confirm the appointment → add a diagnosis/prescription
3. Log in back as **Patient** → view the medical record
4. Log in as **Admin** → view analytics and manage users

---

## API Reference

All endpoints are prefixed with `/api`. Protected endpoints require `Authorization: Bearer <token>`.

### Public — no auth required

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Register new patient account |
| `POST` | `/auth/login` | Login — returns JWT + profile |
| `GET` | `/doctors/public` | List all doctors |
| `GET` | `/doctors/public/{id}` | Doctor detail |
| `GET` | `/specialties` | All medical specialties |

### Patient endpoints — role: PATIENT

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/patient/appointments` | Book appointment (double-book checked) |
| `GET` | `/patient/appointments` | My appointments (newest first) |
| `PATCH` | `/patient/appointments/{id}/cancel` | Cancel an appointment |
| `GET` | `/patient/records` | My medical history |

### Doctor endpoints — role: DOCTOR

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/doctor/profile` | My doctor profile |
| `GET` | `/doctor/appointments` | My full schedule |
| `PATCH` | `/doctor/appointments/{id}/status` | Update appointment status |
| `POST` | `/doctor/records` | Add medical record |
| `GET` | `/doctor/records` | Records I have written |
| `GET` | `/doctor/patients/{patientId}/records` | Specific patient's records |

### Admin endpoints — role: ADMIN

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/users` | All users |
| `PATCH` | `/admin/users/{id}/toggle` | Activate / deactivate user |
| `DELETE` | `/admin/users/{id}` | Delete user |
| `GET` | `/admin/analytics` | System-wide stats |
| `GET` | `/admin/doctors` | All doctors |
| `POST` | `/admin/doctors` | Onboard new doctor |
| `GET` | `/admin/appointments` | All appointments |

### Error format

All errors return a consistent JSON body:

```json
{
  "status": 409,
  "error": "Conflict",
  "message": "This time slot is already booked. Please choose a different slot.",
  "timestamp": "2025-01-15T10:30:00"
}
```

Validation errors return `400` with a field → message map:

```json
{
  "email": "must be a well-formed email address",
  "password": "size must be between 6 and 2147483647"
}
```

---

## Sample Credentials

> **Important:** These passwords are seeded in `schema.sql` for local development only. Change them before any deployment.

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@medora.health` | `Admin@123` |
| Doctor | `sarah.johnson@medora.health` | `Doctor@123` |
| Doctor | `michael.chen@medora.health` | `Doctor@123` |
| Patient | `emily.davis@medora.health` | `Patient@123` |

The **Login page** includes one-click demo buttons to auto-fill credentials for each role.

---

## Logo and Branding

The Medora logo (`docs/medora-logo.svg`) is a flat, two-colour mark:

- **Icon**: Teal rounded square (`#0f9b8e`) containing a white ECG/heartbeat polyline — represents healthcare technology instantly
- **Wordmark**: "Med" in deep navy (`#0d2137`) + "ora" in teal (`#0f9b8e`), Sora 700 weight
- **Design values**: trust (navy), healthcare (heartbeat line), technology (clean geometry), simplicity (flat, two colours)

The React component (`src/assets/MedoraLogo.js`) accepts:

| Prop | Default | Description |
|------|---------|-------------|
| `size` | `40` | Icon width/height in px |
| `showText` | `true` | Show "Medora" wordmark |
| `darkBg` | `false` | White text for dark backgrounds |

### Colour palette

| Token | Hex | Used for |
|-------|-----|---------|
| Medora Teal | `#0f9b8e` | Primary brand, CTAs, active states |
| Teal Dark | `#0b7a6f` | Button hover |
| Teal Light | `#e6f7f6` | Backgrounds, badges |
| Navy | `#0d2137` | Sidebar, headings |
| Navy Light | `#162d47` | Sidebar hover |

---

*Medora is a portfolio project demonstrating production-quality full-stack development with Java Spring Boot and React.*
