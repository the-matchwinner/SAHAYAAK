package com.sahaayak.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sahaayak.backend.dto.MemoryRequest;
import com.sahaayak.backend.model.Memory;
import com.sahaayak.backend.service.MemoryService;

@RestController
@RequestMapping("/api/memories")
@CrossOrigin(origins = "*")
public class MemoryController {

    private final MemoryService service;

    public MemoryController(MemoryService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Memory> createMemory(
            @RequestBody MemoryRequest request) {

        Memory memory = service.createMemory(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(memory);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Memory>> getMemories(
            @PathVariable Long userId) {

        List<Memory> memories = service.getMemoriesByUserId(userId);

        return ResponseEntity.ok(memories);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMemory(
            @PathVariable Long id,
            @RequestBody MemoryRequest request) {

        Memory updated = service.updateMemory(id, request);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Memory not found"));
        }
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMemory(
            @PathVariable Long id) {

        Memory memory = service.getMemoryById(id);

        if (memory == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            "Memory not found"));
        }

        return ResponseEntity.ok(memory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMemory(
            @PathVariable Long id) {

        boolean deleted = service.deleteMemory(id);

        if (!deleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            "Memory not found"));
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Memory deleted successfully"));
    }
}