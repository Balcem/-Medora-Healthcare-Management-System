package com.medora.dto;

public class SpecialtyResponse {
    private Long id;
    private String name, description;

    public SpecialtyResponse() {}
    public SpecialtyResponse(Long id, String name, String description) {
        this.id = id; this.name = name; this.description = description;
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
}
