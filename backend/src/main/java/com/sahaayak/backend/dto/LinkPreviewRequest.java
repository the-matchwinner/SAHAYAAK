
package com.sahaayak.backend.dto;

public class LinkPreviewRequest {

    private String url;

    public LinkPreviewRequest() {
    }

    public LinkPreviewRequest(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
