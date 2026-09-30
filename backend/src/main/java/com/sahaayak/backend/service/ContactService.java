package com.sahaayak.backend.service;
import com.sahaayak.backend.dto.ContactRequest;
import com.sahaayak.backend.model.Contact;
import com.sahaayak.backend.repository.ContactRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ContactService {
private final ContactRepository repository;
public ContactService(ContactRepository repository) {
this.repository = repository;
}
public Contact createContact(ContactRequest request) {
Contact contact = new Contact();
contact.setUserId(request.getUserId());
contact.setName(request.getName());
contact.setRelationship(request.getRelationship());
contact.setPhone(request.getPhone());
contact.setEmergency(request.isEmergency());
return repository.save(contact);
}
public List<Contact> getContactsByUserId(Long userId) {
return repository.findByUserId(userId);}
public Contact getContactById(Long id) {
return repository.findById(id);
public boolean deleteContact(Long id) {
return repository.delete(id);
}
}