package com.example.chatapp.domain;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Date;

class MessageTest {

    @Test
    void testMessage() {
        // Create mock objects
        User fromUser = new User();
        User toUser = new User();
        Chatroom chatroom = new Chatroom();
        Date date = new Date();

        // Create a message
        Message message = new Message("Hello", chatroom, fromUser, toUser, date);

        // Test getters
        assertNotNull(message.getId());
        assertEquals("Hello", message.getContent());
        assertEquals(fromUser, message.getFromUser());
        assertEquals(toUser, message.getToUser());
        assertEquals(chatroom, message.getChatroom());
        assertEquals(date, message.getTime());

        // Test setters
        String newContent = "Hello, World!";
        User newFromUser = new User();
        User newToUser = new User();
        Chatroom newChatroom = new Chatroom();
        Date newDate = new Date();

        message.setContent(newContent);
        message.setFromUser(newFromUser);
        message.setToUser(newToUser);
        message.setChatroom(newChatroom);
        message.setTime(newDate);

        assertEquals(newContent, message.getContent());
        assertEquals(newFromUser, message.getFromUser());
        assertEquals(newToUser, message.getToUser());
        assertEquals(newChatroom, message.getChatroom());
        assertEquals(newDate, message.getTime());
    }
}
