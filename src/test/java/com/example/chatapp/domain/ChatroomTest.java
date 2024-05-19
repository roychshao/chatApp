package com.example.chatapp.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;

class ChatroomTest {
    private Chatroom chatroom;

    @BeforeEach
    void setUp() {
        chatroom = new Chatroom();
    }

    @Test
    void testRoomId() {
        String id = "1234";
        chatroom.setRoomId(id);
        assertEquals(id, chatroom.getRoomId());
    }

    @Test
    void testRoomName() {
        String name = "Test Room";
        chatroom.setRoomName(name);
        assertEquals(name, chatroom.getRoomName());
    }

    @Test
    void testUsers() {
        User user1 = new User();
        User user2 = new User();
        List<User> users = Arrays.asList(user1, user2);
        chatroom.setUsers(users);
        assertEquals(users, chatroom.getUsers());
    }

    @Test
    void testMessages() {
        Message message1 = new Message();
        Message message2 = new Message();
        List<Message> messages = Arrays.asList(message1, message2);
        chatroom.setMessages(messages);
        assertEquals(messages, chatroom.getMessages());
    }
}
