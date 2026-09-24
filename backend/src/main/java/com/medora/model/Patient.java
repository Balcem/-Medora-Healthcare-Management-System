package com.medora.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_type")
    private BloodType bloodType;

    @Column(length = 500)
    private String address;

    @Column(name = "emergency_contact", length = 255)
    private String emergencyContact;

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    private List<Appointment> appointments;

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    private List<MedicalRecord> medicalRecords;

    public Patient() {}

    public enum Gender { MALE, FEMALE, OTHER }
    public enum BloodType { A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }
    public BloodType getBloodType() { return bloodType; }
    public void setBloodType(BloodType bloodType) { this.bloodType = bloodType; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public List<Appointment> getAppointments() { return appointments; }
    public List<MedicalRecord> getMedicalRecords() { return medicalRecords; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Patient o = new Patient();
        public Builder user(User v) { o.user = v; return this; }
        public Builder dateOfBirth(LocalDate v) { o.dateOfBirth = v; return this; }
        public Builder gender(Gender v) { o.gender = v; return this; }
        public Builder bloodType(BloodType v) { o.bloodType = v; return this; }
        public Builder address(String v) { o.address = v; return this; }
        public Builder emergencyContact(String v) { o.emergencyContact = v; return this; }
        public Patient build() { return o; }
    }
}
