package com.medora.dto;

import java.math.BigDecimal;

public class DoctorResponse {
    private Long id, userId, specialtyId;
    private String firstName, lastName, email, phone, specialtyName, licenseNumber, bio;
    private Integer experienceYears;
    private BigDecimal consultationFee;

    public DoctorResponse() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final DoctorResponse o = new DoctorResponse();
        public Builder id(Long v) { o.id = v; return this; }
        public Builder userId(Long v) { o.userId = v; return this; }
        public Builder specialtyId(Long v) { o.specialtyId = v; return this; }
        public Builder firstName(String v) { o.firstName = v; return this; }
        public Builder lastName(String v) { o.lastName = v; return this; }
        public Builder email(String v) { o.email = v; return this; }
        public Builder phone(String v) { o.phone = v; return this; }
        public Builder specialtyName(String v) { o.specialtyName = v; return this; }
        public Builder licenseNumber(String v) { o.licenseNumber = v; return this; }
        public Builder bio(String v) { o.bio = v; return this; }
        public Builder experienceYears(Integer v) { o.experienceYears = v; return this; }
        public Builder consultationFee(BigDecimal v) { o.consultationFee = v; return this; }
        public DoctorResponse build() { return o; }
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getSpecialtyId() { return specialtyId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getSpecialtyName() { return specialtyName; }
    public String getLicenseNumber() { return licenseNumber; }
    public String getBio() { return bio; }
    public Integer getExperienceYears() { return experienceYears; }
    public BigDecimal getConsultationFee() { return consultationFee; }
}
