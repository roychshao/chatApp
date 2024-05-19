package com.example.chatapp.controller;

import com.example.chatapp.domain.User;
import com.example.chatapp.domain.Message;
import com.example.chatapp.domain.Chatroom;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Date;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Transactional
class MessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @PersistenceContext
    private EntityManager em;

    @Test
    void testGetRecentFiftyMessage() throws Exception {
        User user1 = new User("testUser1", "men", 18, "com.example.1@gmail.com", "123456");
        User user2 = new User("testUser2", "women", 20, "com.example.2@gmail.com", "654321");
        em.persist(user1);
        em.persist(user2);
        Chatroom room = new Chatroom("testCreateChatroom", List.of(user1, user2));
        em.persist(room);
        Message message = new Message("test", room, user1, user2, new Date());
        message.setChatroom(room);
        String roomId = room.getRoomId();
        em.persist(message);

        mockMvc.perform(get("/api/message/{roomId}/recentfifty", roomId)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());
    }
}
