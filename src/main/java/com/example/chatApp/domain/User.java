package com.example.chatApp.domain;

import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import jakarta.persistence.*;

@Entity
@Table(name = "_User")
public class User {

    @Id
    private String userId;
    private String name;
    private String gender;
    private String email;
    private String password;
    private int age;
  
    @ManyToMany(mappedBy = "users")
    private Set<Chatroom> chatrooms = new HashSet<>();

    @OneToMany(mappedBy = "fromUser")
    private List<Message> messageFrom = new ArrayList<>();

    @OneToMany(mappedBy = "toUser")
    private List<Message> messageTo = new ArrayList<>();

    public User() {
    }

    public User(String n, String g, int a, String e, String p) {
        setName(n);
        setGender(g);
        setAge(a);
        setId(UUID.randomUUID().toString());
        setEmail(e);
        setPassword(p);
    }

    public String getName() {
        return name;
    }

    public void setName(String str) {
        name = str;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int a) {
        age = a;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String str) {
        gender = str;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String e) {
        email = e;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String p) {
        password = p;
    }

    public String getId() {
        return userId;
    }

    public void setId(String i) {
        userId = i;
    }
}
