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

import com.sahaayak.backend.dto.ContactRequest;
import com.sahaayak.backend.model.Contact;
import com.sahaayak.backend.service.ContactService;
@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins =
"*")
public class ContactController {
private final ContactService service;
public ContactController(ContactService service) {
this.service = service;
}
@PostMapping
public ResponseEntity<Contact> createContact(
@RequestBody ContactRequest request) {
Contact contact = service.createContact(request);
return ResponseEntity
.status(HttpStatus.CREATED)
.body(contact);
}
@GetMapping("/user/{userId}")
public ResponseEntity<List<Contact>> getContacts(
@PathVariable Long userId) {
return ResponseEntity.ok(
service.getContactsByUserId(userId));
}
@PutMapping("/{id}")
public ResponseEntity<?> updateContact(
@PathVariable Long id,
@RequestBody ContactRequest request) {
Contact contact = service.updateContact(id, request);
if (contact == null) {
return ResponseEntity.status(HttpStatus.NOT_FOUND)
.body(Map.of("error", "Contact not found"));
}
return ResponseEntity.ok(contact);
}
@GetMapping("/{id}")
public ResponseEntity<?> getContact(
@PathVariable Long id) {
Contact contact = service.getContactById(id);
if (contact == null) {
return ResponseEntity
.status(HttpStatus.NOT_FOUND)
.body(Map.of("error"
,
"Contact not found"));
}
return ResponseEntity.ok(contact);
}
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteContact(
@PathVariable Long id) {
boolean deleted = service.deleteContact(id);
if (!deleted) {
return ResponseEntity
.status(HttpStatus.NOT_FOUND)
.body(Map.of("error"
,
"Contact not found"));
}
return ResponseEntity.ok(
Map.of("message"
,
"Contact deleted successfully"));
}
}
