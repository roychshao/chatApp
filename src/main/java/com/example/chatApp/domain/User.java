package com.example.chatApp.domain;

import java.util.ArrayList;
import java.util.List;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.math.BigInteger;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "_User")
public class User {

    @Id
    @Column(name = "USERID")
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
        setUserId(hashEmail(e));
        setEmail(e);
        setPassword(p);
    }

    public String hashEmail(String email) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(email.getBytes(StandardCharsets.UTF_8));
            BigInteger number = new BigInteger(1, hash);
            StringBuilder hexString = new StringBuilder(number.toString(16));
            while (hexString.length() < 32) {
                hexString.insert(0, '0');
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
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
