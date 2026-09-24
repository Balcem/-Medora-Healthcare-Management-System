package com.medora.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class RegisterRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank @Email private String email;
    @NotBlank @Size(min = 6) private String password;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodType;
    private String address;

    public RegisterRequest() {}
    public String getFirstName() { return firstName; }
    public void setFirstName(String v) { this.firstName = v; }
    public String getLastName() { return lastName; }
    public void setLastName(String v) { this.lastName = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPassword() { return password; }
    public void setPassword(String v) { this.password = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate v) { this.dateOfBirth = v; }
    public String getGender() { return gender; }
    public void setGender(String v) { this.gender = v; }
    public String getBloodType() { return bloodType; }
    public void setBloodType(String v) { this.bloodType = v; }
    public String getAddress() { return address; }
    public void setAddress(String v) { this.address = v; }
}
