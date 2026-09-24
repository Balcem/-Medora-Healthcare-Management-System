package com.medora.dto;

import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String firstName, lastName, email, phone, role;
    private boolean active;
    private LocalDateTime createdAt;

    public UserResponse() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final UserResponse o = new UserResponse();
        public Builder id(Long v) { o.id = v; return this; }
        public Builder firstName(String v) { o.firstName = v; return this; }
        public Builder lastName(String v) { o.lastName = v; return this; }
        public Builder email(String v) { o.email = v; return this; }
        public Builder phone(String v) { o.phone = v; return this; }
        public Builder role(String v) { o.role = v; return this; }
        public Builder active(boolean v) { o.active = v; return this; }
        public Builder createdAt(LocalDateTime v) { o.createdAt = v; return this; }
        public UserResponse build() { return o; }
    }

    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getRole() { return role; }
    public boolean isActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
