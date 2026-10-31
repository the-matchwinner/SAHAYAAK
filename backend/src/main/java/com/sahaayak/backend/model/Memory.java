
package com.sahaayak.backend.model;

import java.time.LocalDate;

public class Memory {

    private Long id;
    private Long userId;
    private String title;
    private String description;
    private LocalDate memoryDate;
    private String imageUrl;
    private String sourceUrl;

    public Memory() {
    }

    public Memory(Long id, Long userId, String title,
            String description, LocalDate memoryDate,
            String imageUrl, String sourceUrl) {

        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.memoryDate = memoryDate;
        this.imageUrl = imageUrl;
        this.sourceUrl = sourceUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getMemoryDate() {
        return memoryDate;
    }

    public void setMemoryDate(LocalDate memoryDate) {
        this.memoryDate = memoryDate;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }
}
