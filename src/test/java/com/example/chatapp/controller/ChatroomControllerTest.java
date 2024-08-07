package com.example.chatapp.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.chatapp.domain.Chatroom;
import com.example.chatapp.domain.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.util.Assert;

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
        User user1 = new User(
            "testGetUserChatrooms_Found1",
            "men",
            18,
            "com.example.1@gmail.com",
            "123456"
        );
        User user2 = new User(
            "testGetUserChatrooms_Found2",
            "women",
            20,
            "com.example.2@gmail.com",
            "654321"
        );
        User user3 = new User(
            "testGetUserChatrooms_Found3",
            "men",
            22,
            "com.example.3@gmail.com",
            "135791"
        );
        em.persist(user1);
        em.persist(user2);
        em.persist(user3);
        List<User> users12 = List.of(user1, user2);
        List<User> users13 = List.of(user1, user3);
        Chatroom testChatroom1 = new Chatroom("testChatroom1", users12);
        Chatroom testChatroom2 = new Chatroom("testChatroom2", users13);
        em.persist(testChatroom1);
        em.persist(testChatroom2);

        mockMvc
            .perform(get("/api/chatroom/user/{userId}", user1.getUserId()))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].roomId").value(testChatroom1.getRoomId()))
            .andExpect(
                jsonPath("$[0].roomName").value(testChatroom1.getRoomName())
            )
            .andExpect(
                jsonPath("$[0].users[0].userId").value(user1.getUserId())
            )
            .andExpect(
                jsonPath("$[0].users[1].userId").value(user2.getUserId())
            )
            .andExpect(jsonPath("$[1].roomId").value(testChatroom2.getRoomId()))
            .andExpect(
                jsonPath("$[1].roomName").value(testChatroom2.getRoomName())
            )
            .andExpect(
                jsonPath("$[1].users[0].userId").value(user1.getUserId())
            )
            .andExpect(
                jsonPath("$[1].users[1].userId").value(user3.getUserId())
            );
    }

    @Test
    void testGetChatroomById_Found() throws Exception {
        Chatroom testRoom = new Chatroom("testRoom");
        em.persist(testRoom);

        mockMvc
            .perform(get("/api/chatroom/{roomId}", testRoom.getRoomId()))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.roomId").value(testRoom.getRoomId()))
            .andExpect(jsonPath("$.roomName").value(testRoom.getRoomName()))
            .andExpect(jsonPath("$.users").isEmpty());
    }

    @Test
    void testCreateChatroom() throws Exception {
        User user1 = new User(
            "testUser1",
            "men",
            18,
            "com.example.1@gmail.com",
            "123456"
        );
        User user2 = new User(
            "testUser2",
            "women",
            20,
            "com.example.2@gmail.com",
            "654321"
        );
        em.persist(user1);
        em.persist(user2);
        Chatroom createdChatRoom = new Chatroom(
            "testCreateChatroom",
            List.of(user1, user2)
        );

        MvcResult result = mockMvc
            .perform(
                post("/api/chatroom/create")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createdChatRoom))
            )
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(
                jsonPath("$.roomName").value(createdChatRoom.getRoomName())
            )
            .andExpect(jsonPath("$.users[0].userId").value(user1.getUserId()))
            .andExpect(jsonPath("$.users[1].userId").value(user2.getUserId()))
            .andReturn();

        Map<String, String> response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            Map.class
        );

        String roomId = (String) response.get("roomId");
        Chatroom savedRoom = em.find(Chatroom.class, roomId);

        Assert.notNull(savedRoom, "Chatroom not found in the database");
        Assert.isTrue(
            savedRoom.getRoomName().equals(createdChatRoom.getRoomName()),
            "Chatroom name does not match"
        );
        Assert.isTrue(
            savedRoom
                .getUsers()
                .get(0)
                .getUserId()
                .equals(createdChatRoom.getUsers().get(0).getUserId()),
            "Chatroom user1 do not match"
        );
        Assert.isTrue(
            savedRoom
                .getUsers()
                .get(1)
                .getUserId()
                .equals(createdChatRoom.getUsers().get(1).getUserId()),
            "Chatroom user2 do not match"
        );
    }

    @Test
    void testUpdateChatroom() throws Exception {
        User user1 = new User(
            "testUser1",
            "men",
            18,
            "com.example.1@gmail.com",
            "123456"
        );
        User user2 = new User(
            "testUser2",
            "women",
            20,
            "com.example.2@gmail.com",
            "654321"
        );
        em.persist(user1);
        em.persist(user2);

        Chatroom testRoom = new Chatroom("testRoom", List.of(user1));
        em.persist(testRoom);

        Chatroom updatedChatRoom = new Chatroom(
            "testUpdateChatroom",
            List.of(user1, user2)
        );

        mockMvc
            .perform(
                put("/api/chatroom/update")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updatedChatRoom))
            )
            .andDo(print())
            .andExpect(status().isOk());

        Chatroom updatedRoom = em.find(
            Chatroom.class,
            updatedChatRoom.getRoomId()
        );
        Assert.notNull(updatedRoom, "Chatroom not found in the database");
        Assert.isTrue(
            updatedRoom.getRoomName().equals(updatedChatRoom.getRoomName()),
            "Chatroom name does not match"
        );
        Assert.isTrue(
            updatedRoom
                .getUsers()
                .get(0)
                .getUserId()
                .equals(updatedChatRoom.getUsers().get(0).getUserId()),
            "Chatroom user1 do not match"
        );
        Assert.isTrue(
            updatedRoom
                .getUsers()
                .get(1)
                .getUserId()
                .equals(updatedChatRoom.getUsers().get(1).getUserId()),
            "Chatroom user2 do not match"
        );
    }

    @Test
    void testDeleteChatroom() throws Exception {
        Chatroom testRoom = new Chatroom("testRoom");
        em.persist(testRoom);

        mockMvc
            .perform(
                delete("/api/chatroom/delete")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testRoom))
            )
            .andDo(print())
            .andExpect(status().isOk());

        Assert.isNull(
            em.find(Chatroom.class, testRoom.getRoomId()),
            "Chatroom not deleted from the database"
        );
    }
}
