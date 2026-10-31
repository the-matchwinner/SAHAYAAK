
package com.sahaayak.backend.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.sahaayak.backend.model.Memory;

@Repository
public class MemoryRepository {

    private final JdbcTemplate jdbcTemplate;

    public MemoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // MAP DATABASE ROW TO MEMORY OBJECT
    private final RowMapper<Memory> rowMapper = (rs, rowNum) -> new Memory(
            rs.getLong("id"),
            rs.getLong("user_id"),
            rs.getString("title"),
            rs.getString("description"),
            rs.getDate("memory_date") != null
                    ? rs.getDate("memory_date").toLocalDate()
                    : null,
            rs.getString("image_url"),
            rs.getString("source_url")
    );

    // CREATE MEMORY
    public Memory save(Memory memory) {

        String sql = """
                INSERT INTO memories
                (user_id, title, description, memory_date,
                 image_url, source_url)
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING id
                """;

        Long id = jdbcTemplate.queryForObject(
                sql,
                Long.class,
                memory.getUserId(),
                memory.getTitle(),
                memory.getDescription(),
                memory.getMemoryDate(),
                memory.getImageUrl(),
                memory.getSourceUrl()
        );

        memory.setId(id);

        return memory;
    }

    // GET ALL MEMORIES OF A USER
    public List<Memory> findByUserId(Long userId) {

        String sql = """
                SELECT id, user_id, title, description,
                       memory_date, image_url, source_url
                FROM memories
                WHERE user_id = ?
                ORDER BY memory_date DESC
                """;

        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    // GET MEMORY BY ID
    public Memory findById(Long id) {

        String sql = """
                SELECT id, user_id, title, description,
                       memory_date, image_url, source_url
                FROM memories
                WHERE id = ?
                """;

        List<Memory> results =
                jdbcTemplate.query(sql, rowMapper, id);

        return results.isEmpty() ? null : results.get(0);
    }

    // UPDATE MEMORY
    public boolean update(Memory memory) {

        String sql = """
                UPDATE memories
                SET title = ?,
                    description = ?,
                    memory_date = ?,
                    image_url = ?,
                    source_url = ?
                WHERE id = ? AND user_id = ?
                """;

        return jdbcTemplate.update(
                sql,
                memory.getTitle(),
                memory.getDescription(),
                memory.getMemoryDate(),
                memory.getImageUrl(),
                memory.getSourceUrl(),
                memory.getId(),
                memory.getUserId()
        ) > 0;
    }

    // DELETE MEMORY
    public boolean delete(Long id) {

        String sql = """
                DELETE FROM memories
                WHERE id = ?
                """;

        return jdbcTemplate.update(sql, id) > 0;
    }
}
