package com.medora.dto;

import java.time.LocalDate;

public class PatientResponse {
    private Long id, userId;
    private String firstName, lastName, email, phone, gender, bloodType, address, emergencyContact;
    private LocalDate dateOfBirth;

    public PatientResponse() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final PatientResponse o = new PatientResponse();
        public Builder id(Long v) { o.id = v; return this; }
        public Builder userId(Long v) { o.userId = v; return this; }
        public Builder firstName(String v) { o.firstName = v; return this; }
        public Builder lastName(String v) { o.lastName = v; return this; }
        public Builder email(String v) { o.email = v; return this; }
        public Builder phone(String v) { o.phone = v; return this; }
        public Builder gender(String v) { o.gender = v; return this; }
        public Builder bloodType(String v) { o.bloodType = v; return this; }
        public Builder address(String v) { o.address = v; return this; }
        public Builder emergencyContact(String v) { o.emergencyContact = v; return this; }
        public Builder dateOfBirth(LocalDate v) { o.dateOfBirth = v; return this; }
        public PatientResponse build() { return o; }
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getGender() { return gender; }
    public String getBloodType() { return bloodType; }
    public String getAddress() { return address; }
    public String getEmergencyContact() { return emergencyContact; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
}
