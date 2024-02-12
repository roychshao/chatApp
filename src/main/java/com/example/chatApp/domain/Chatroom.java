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
    private List<User> users = new ArrayList<>();

    public Chatroom() {
    }

    public Chatroom(List<User> usrs, List<Message> msgs) {
        setRoomId(UUID.randomUUID().toString());
        setUsers(usrs);
        setMessages(msgs);
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> u) {
        users = u;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> msgs) {
        messages = msgs;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String id) {
        roomId = id;
    }
}
