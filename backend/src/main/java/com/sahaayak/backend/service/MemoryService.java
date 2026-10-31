
package com.sahaayak.backend.service;

import java.net.URI;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sahaayak.backend.dto.MemoryRequest;
import com.sahaayak.backend.model.Memory;
import com.sahaayak.backend.repository.MemoryRepository;

@Service
public class MemoryService {

    private final MemoryRepository repository;

    public MemoryService(MemoryRepository repository) {
        this.repository = repository;
    }

    public Memory createMemory(MemoryRequest request) {

        validateSourceUrl(request.getSourceUrl());

        Memory memory = new Memory();

        memory.setUserId(request.getUserId());
        memory.setTitle(request.getTitle());
        memory.setDescription(request.getDescription());
        memory.setMemoryDate(request.getMemoryDate());
        memory.setImageUrl(request.getImageUrl());
        memory.setSourceUrl(normalizeSourceUrl(request.getSourceUrl()));

        return repository.save(memory);
    }

    public List<Memory> getMemoriesByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    public Memory getMemoryById(Long id) {
        return repository.findById(id);
    }

    public Memory updateMemory(Long id, MemoryRequest request) {

        validateSourceUrl(request.getSourceUrl());

        Memory memory = new Memory();

        memory.setId(id);
        memory.setUserId(request.getUserId());
        memory.setTitle(request.getTitle());
        memory.setDescription(request.getDescription());
        memory.setMemoryDate(request.getMemoryDate());
        memory.setImageUrl(request.getImageUrl());
        memory.setSourceUrl(normalizeSourceUrl(request.getSourceUrl()));

        return repository.update(memory)
                ? repository.findById(id)
                : null;
    }

    public boolean deleteMemory(Long id) {
        return repository.delete(id);
    }

    private String normalizeSourceUrl(String sourceUrl) {
        if (sourceUrl == null || sourceUrl.isBlank()) {
            return null;
        }

        return sourceUrl.trim();
    }

    private void validateSourceUrl(String sourceUrl) {

        if (sourceUrl == null || sourceUrl.isBlank()) {
            return;
        }

        try {
            URI uri = URI.create(sourceUrl.trim());

            String scheme = uri.getScheme();

            if (!uri.isAbsolute()
                    || uri.getHost() == null
                    || scheme == null
                    || !(scheme.equalsIgnoreCase("http")
                    || scheme.equalsIgnoreCase("https"))) {

                throw new IllegalArgumentException(
                        "Source URL must be a valid HTTP or HTTPS link."
                );
            }

        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "Source URL must be a valid HTTP or HTTPS link."
            );
        }
    }
}
