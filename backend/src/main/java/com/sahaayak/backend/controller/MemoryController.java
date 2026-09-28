package com.sahaayak.backend.controller;

import com.sahaayak.backend.dto.MemoryRequest;
import com.sahaayak.backend.model.Memory;
import com.sahaayak.backend.service.MemoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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