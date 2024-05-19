package com.example.chatapp.domain;

import jakarta.persistence.*;
import java.util.UUID;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "_Chatroom")
public class Chatroom {

    @Id
    private String roomId;

    private String roomName;

    @OneToMany(mappedBy = "chatroom")
    @JsonManagedReference
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

    public Chatroom(String n) {
        setRoomId(UUID.randomUUID().toString());
        setRoomName(n);
    }

    public Chatroom(String n, List<User> usrs) {
        setRoomId(UUID.randomUUID().toString());
        setUsers(usrs);
        setRoomName(n);
    }

    public Chatroom(String n, List<User> usrs, List<Message> msgs) {
        setRoomId(UUID.randomUUID().toString());
        setUsers(usrs);
        setMessages(msgs);
        setRoomName(n);
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

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String name) {
        roomName = name;
    }
}
