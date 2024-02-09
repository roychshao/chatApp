package com.example.chatApp.domain;

import java.util.UUID;
import jakarta.persistence.*;
import com.example.chatApp.domain.User;
import com.example.chatApp.domain.Chatroom;

@Entity
@Table(name = "_Message")
public class Message {

    @Id
    private String messageId;
    private String content;

    @ManyToOne
    @JoinColumn(name = "fromUserId", referencedColumnName = "userId", nullable = false)
    private User fromUser;

    @ManyToOne
    @JoinColumn(name = "toUserId", referencedColumnName = "userId", nullable = false)
    private User toUser;

    @ManyToOne
    @JoinColumn(name = "chatroomId", referencedColumnName = "roomId", nullable = false)
    private Chatroom chatroom;

    public Message () {
    }

    public Message (String m, String f, String t) {
        id = UUID.randomUUID().toString();
        setContent(m);
        setFrom(f);
        setTo(t);
    }

    public String getId() {
        return messageId;
    }

    public void setId(int id) {
        messageId = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String str) {
        this.content = str;
    }

    public String getFrom() {
        return fromUser;
    }

    public void setFrom(String userId) {
        fromUser = userId;
    }

    public String getTo() {
        return toUser;
    }

    public void setTo(String userId) {
        toUser = userId;
    }
}
