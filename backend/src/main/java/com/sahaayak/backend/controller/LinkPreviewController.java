
package com.sahaayak.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sahaayak.backend.dto.LinkPreviewRequest;
import com.sahaayak.backend.dto.LinkPreviewResponse;
import com.sahaayak.backend.service.LinkPreviewService;

@RestController
@RequestMapping("/api/link-preview")
@CrossOrigin(origins = "*")
public class LinkPreviewController {

    private final LinkPreviewService service;

    public LinkPreviewController(LinkPreviewService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LinkPreviewResponse> getLinkPreview(
            @RequestBody LinkPreviewRequest request) {

        LinkPreviewResponse response =
                service.getLinkPreview(request.getUrl());

        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidRequest(
            IllegalArgumentException exception) {

        return ResponseEntity.badRequest()
                .body(Map.of("error", exception.getMessage()));
    }
}
