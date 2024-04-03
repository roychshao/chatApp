package com.example.chatApp.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @ManyToMany()
    @JoinTable(
        name = "user_friends",
        joinColumns = @JoinColumn(name = "userId"),
        inverseJoinColumns = @JoinColumn(name = "friendId")
    )
    @JsonIgnore // avoid infnite recursion when serializing
    private List<User> friends = new ArrayList<>();

    @ManyToMany(mappedBy = "users")
    private List<Chatroom> chatrooms = new ArrayList<>();

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
        setUserId(UUID.randomUUID().toString());
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String i) {
        userId = i;
    }

    public List<User> getFriends() {
        return friends;
    }

    public void setFriends(List<User> f) {
        friends = f;
    }
}
