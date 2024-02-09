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

    public Chatroom(User[] usrs) {
        setId(UUID.randomUUID().toString());
        for (int i = 0; i < usrs.length; ++i) {
            users.add(usrs[i]);
        }
    }

    public String getId() {
        return roomId;
    }

    public void setId(String id) {
        roomId = id;
    }

    public void addUser(User usr) {
        users.add(usr);
    }

    public void kickUser(User usr) {
        for (int i = 0; i < users.size(); ++i) {
            if (users.get(i).getId() == usr.getId()) {
                users.remove(i);
            }
        }
    }

    public void leave(User usr) {
        for (int i = 0; i < users.size(); ++i) {
            if (users.get(i).getId() == usr.getId()) {
                users.remove(i);
            }
        }
    }
}
