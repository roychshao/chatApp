package com.example.chatApp.domain;

import java.util.UUID;
import java.util.Date;
import jakarta.persistence.*;

@Entity
@Table(name = "_Message")
public class Message {

    @Id
    private String messageId;
    private String content;

    @ManyToOne
    @JoinColumn(name = "fromUserId", referencedColumnName = "userId", nullable = true)
    private User fromUser;

	@ManyToOne
    @JoinColumn(name = "toUserId", referencedColumnName = "userId", nullable = true)
    private User toUser;

	@ManyToOne
    @JoinColumn(name = "chatroomId", referencedColumnName = "roomId", nullable = true)
    private Chatroom chatroom;

    private Date time;

    public Message () {
    }

    public Message (String m, User f, User t, Date d) {
        messageId = UUID.randomUUID().toString();
        setContent(m);
        setFromUser(f);
        setToUser(t);
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

    public User getFromUser() {
        return fromUser;
    }

    public void setFromUser(User fromUser) {
        this.fromUser = fromUser;
    }

    public User getToUser() {
        return toUser;
    }

    public void setToUser(User toUser) {
        this.toUser = toUser;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date t) {
        time = t;
    }
}
