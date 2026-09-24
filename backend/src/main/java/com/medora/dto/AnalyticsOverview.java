package com.medora.dto;

public class AnalyticsOverview {
    private long totalUsers, totalDoctors, totalPatients, totalAppointments, todayAppointments;

    public AnalyticsOverview() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final AnalyticsOverview o = new AnalyticsOverview();
        public Builder totalUsers(long v) { o.totalUsers = v; return this; }
        public Builder totalDoctors(long v) { o.totalDoctors = v; return this; }
        public Builder totalPatients(long v) { o.totalPatients = v; return this; }
        public Builder totalAppointments(long v) { o.totalAppointments = v; return this; }
        public Builder todayAppointments(long v) { o.todayAppointments = v; return this; }
        public AnalyticsOverview build() { return o; }
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalDoctors() { return totalDoctors; }
    public long getTotalPatients() { return totalPatients; }
    public long getTotalAppointments() { return totalAppointments; }
    public long getTodayAppointments() { return todayAppointments; }
}
