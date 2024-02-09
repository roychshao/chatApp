package com.example.chatApp.domain;

import java.util.UUID;
import java.util.Date;
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

    private Date time;

    public Message () {
    }

    public Message (String m, User f, User t, Date d) {
        messageId = UUID.randomUUID().toString();
        setContent(m);
        setFrom(f);
        setTo(t);
        setTime(d);
    }

    public String getId() {
        return messageId;
    }

    public void setId(String id) {
        messageId = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String str) {
        this.content = str;
    }

    public User getFrom() {
        return fromUser;
    }

    public void setFrom(User user) {
        fromUser = user;
    }

    public User getTo() {
        return toUser;
    }

    public void setTo(User user) {
        toUser = user;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date t) {
        time = t;
    }
}
