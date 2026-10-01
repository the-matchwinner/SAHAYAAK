package com.sahaayak.backend.service;

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

    public Memory updateMemory(Long id, MemoryRequest request) {
        Memory memory = new Memory();
        memory.setId(id);
        memory.setUserId(request.getUserId());
        memory.setTitle(request.getTitle());
        memory.setDescription(request.getDescription());
        memory.setMemoryDate(request.getMemoryDate());
        memory.setImageUrl(request.getImageUrl());

        return repository.update(memory) ? repository.findById(id) : null;
    }

    public boolean deleteMemory(Long id) {

        return repository.delete(id);
    }
}