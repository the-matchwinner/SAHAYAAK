
package com.sahaayak.backend.dto;

public class LinkPreviewResponse {

    private String url;
    private String title;
    private String description;
    private String imageUrl;
    private String siteName;

    public LinkPreviewResponse() {
    }

    public LinkPreviewResponse(
            String url,
            String title,
            String description,
            String imageUrl,
            String siteName) {

        this.url = url;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.siteName = siteName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }
}
