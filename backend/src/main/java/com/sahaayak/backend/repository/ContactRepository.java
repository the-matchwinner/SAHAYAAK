package com.sahaayak.backend.repository;
import com.sahaayak.backend.model.Contact;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public class ContactRepository {
private final JdbcTemplate jdbcTemplate;
public ContactRepository(JdbcTemplate jdbcTemplate) {
this.jdbcTemplate = jdbcTemplate;
}
private final RowMapper<Contact> rowMapper = (rs, rowNum) ->
new Contact(
rs.getLong("id"),
rs.getLong("user_id"),
rs.getString("name"),
rs.getString("relationship"),
rs.getString("phone"),
rs.getBoolean("is_emergency")
);
public Contact save(Contact contact) {
String sql =
"""
INSERT INTO contacts
(user_id, name, relationship, phone, is_emergency)
VALUES (?, ?, ?, ?, ?)
RETURNING id
""";
Long id = jdbcTemplate.queryForObject(
sql, Long.class,
contact.getUserId(),
contact.getName(),
contact.getRelationship(),
contact.getPhone(),
contact.isEmergency()
);
contact.setId(id);
return contact;
}
public List<Contact> findByUserId(Long userId) {
String sql =
"""
SELECT id, user_id, name, relationship,
phone, is_emergency
FROM contacts
WHERE user_id = ?
ORDER BY id
""";
return jdbcTemplate.query(sql, rowMapper, userId);
}
public Contact findById(Long id) {
String sql =
"""
SELECT id, user_id, name, relationship,
phone, is_emergency
FROM contacts
WHERE id = ?
""";
List<Contact> results =
jdbcTemplate.query(sql, rowMapper, id);
return results.isEmpty() ? null : results.get(0);
}
public boolean delete(Long id) {
return jdbcTemplate.update(
"DELETE FROM contacts WHERE id = ?"
, id
) > 0;
}
}
