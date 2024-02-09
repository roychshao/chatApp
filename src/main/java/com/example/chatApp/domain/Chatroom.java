package com.example.chatApp.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.UUID;
import com.example.chatApp.domain.User;
import com.example.chatApp.domain.Message;

@Entity
@Table(name = "_Chatroom")
public class Chatroom {

    @Id
    private String roomId;

    private ArrayList<User> users;

    @OneToMany(mappedBy = "chatroom", cascade = CascadeType.REMOVE)
    private ArrayList<Message> messages;

    public Chatroom() {
    }

    public Chatroom(ArrayList<User> usrs) {
        setId(UUID.randomUUID().toString());
        setUsers(usrs);
    }

    public ArrayList<User> getUsers() {
        return users;
    }

    public void setUsers(ArrayList<User> u) {
        users = u;
    }

    public String getId() {
        return roomId;
    }

    public void setId(String id) {
        roomId = id;
    }
}