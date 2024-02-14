package com.example.chatApp.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.util.Assert;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.example.chatApp.domain.User;
import com.example.chatApp.domain.Chatroom;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Transactional
class ChatroomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @PersistenceContext
    private EntityManager em;

    @Test
    void testGetUserChatrooms_Found() throws Exception {

        User user1 = new User("testGetUserChatrooms_Found1", "men", 18, "com.example.1@gmail.com", "123456");
        User user2 = new User("testGetUserChatrooms_Found2", "women", 20, "com.example.2@gmail.com", "654321");
        User user3 = new User("testGetUserChatrooms_Found3", "men", 22, "com.example.3@gmail.com", "135791");
        em.persist(user1);
        em.persist(user2);
        em.persist(user3);
        List<User> users12 = List.of(user1, user2);
        List<User> users13 = List.of(user1, user3);
        Chatroom testChatroom1 = new Chatroom(users12);
        Chatroom testChatroom2 = new Chatroom(users13);
        em.persist(testChatroom1);
        em.persist(testChatroom2);

        mockMvc.perform(get("/api/chatroom/user/{userId}", user1.getUserId()))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].roomId").value(testChatroom1.getRoomId()))
            .andExpect(jsonPath("$[0].users[0].userId").value(user1.getUserId()))
            .andExpect(jsonPath("$[0].users[1].userId").value(user2.getUserId()))
            .andExpect(jsonPath("$[1].roomId").value(testChatroom2.getRoomId()))
            .andExpect(jsonPath("$[1].users[0].userId").value(user1.getUserId()))
            .andExpect(jsonPath("$[1].users[1].userId").value(user3.getUserId()));
    }
}
