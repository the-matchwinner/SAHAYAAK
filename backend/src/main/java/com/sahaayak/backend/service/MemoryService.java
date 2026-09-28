package com.sahaayak.backend.service;

import com.sahaayak.backend.dto.MemoryRequest;
import com.sahaayak.backend.model.Memory;
import com.sahaayak.backend.repository.MemoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemoryService {

    private final MemoryRepository repository;

    public MemoryService(MemoryRepository repository) {
        this.repository = repository;
    }

    public Memory createMemory(MemoryRequest request) {

        Memory memory = new Memory();

        memory.setUserId(request.getUserId());
        memory.setTitle(request.getTitle());
        memory.setDescription(request.getDescription());
        memory.setMemoryDate(request.getMemoryDate());
        memory.setImageUrl(request.getImageUrl());

        return repository.save(memory);
    }

    public List<Memory> getMemoriesByUserId(Long userId) {

        return repository.findByUserId(userId);
    }

    public Memory getMemoryById(Long id) {

        return repository.findById(id);
    }

    public boolean deleteMemory(Long id) {

        return repository.delete(id);
    }
}