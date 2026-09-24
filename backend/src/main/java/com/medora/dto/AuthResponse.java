package com.medora.dto;

public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private String role;
    private Long profileId;

    public AuthResponse() {}
    public AuthResponse(String token, String email, String fullName, String role, Long profileId) {
        this.token = token; this.email = email; this.fullName = fullName;
        this.role = role; this.profileId = profileId;
    }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private String token, email, fullName, role;
        private Long profileId;
        public Builder token(String v) { this.token = v; return this; }
        public Builder email(String v) { this.email = v; return this; }
        public Builder fullName(String v) { this.fullName = v; return this; }
        public Builder role(String v) { this.role = v; return this; }
        public Builder profileId(Long v) { this.profileId = v; return this; }
        public AuthResponse build() { return new AuthResponse(token, email, fullName, role, profileId); }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Long getProfileId() { return profileId; }
    public void setProfileId(Long profileId) { this.profileId = profileId; }
}
