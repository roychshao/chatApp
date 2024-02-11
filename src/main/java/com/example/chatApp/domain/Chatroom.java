package com.example.chatApp.domain;

import jakarta.persistence.*;
import java.util.Set;
import java.util.UUID;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "_Chatroom")
public class Chatroom {

    @Id
    private String roomId;

    @OneToMany(mappedBy = "chatroom")
    private List<Message> messages = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "chatroom_user",
        joinColumns = @JoinColumn(name = "roomId"),
        inverseJoinColumns = @JoinColumn(name = "userId")
    )
    private Set<User> users = new HashSet<>();

    public Chatroom() {
    }

    public Chatroom(Set<User> usrs) {
        setId(UUID.randomUUID().toString());
        setUsers(usrs);
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> u) {
        users = u;
    }

    public String getId() {
        return roomId;
    }

    public void setId(String id) {
        roomId = id;
    }
}
