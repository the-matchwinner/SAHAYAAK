package com.sahaayak.backend.dto;
public class ContactRequest {
private Long userId;
private String name;
private String relationship;
private String phone;
private boolean emergency;
public ContactRequest() {}
public Long getUserId() { return userId; }
public void setUserId(Long userId) { this.userId = userId; }
public String getName() { return name; }
public void setName(String name) { this.name = name; }
public String getRelationship() { return relationship; }
public void setRelationship(String relationship) {
this.relationship = relationship;
}
public String getPhone() { return phone; }
public void setPhone(String phone) { this.phone = phone; }
public boolean isEmergency() { return emergency; }

public void setEmergency(boolean emergency) { this.emergency = emergency; }