package com.example.chatApp.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.util.Map;
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

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Transactional
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @PersistenceContext
    private EntityManager em;

    @Test
    void testGetUserById_Found() throws Exception {

        User testUser = new User("testGetUserById_Found", "men", 18, "com.example@gmail.com", "123456");
        em.persist(testUser);

        mockMvc.perform(get("/api/user/{userId}", testUser.getUserId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(testUser.getUserId()))
                .andExpect(jsonPath("$.name").value(testUser.getName()))
                .andExpect(jsonPath("$.gender").value(testUser.getGender()))
                .andExpect(jsonPath("$.age").value(testUser.getAge()))
                .andExpect(jsonPath("$.email").value(testUser.getEmail()))
                .andExpect(jsonPath("$.password").value(testUser.getPassword()));

    }

    @Test
    void testSignIn() throws Exception {
        
        User signinUser = new User("testRegister", "men", 18, "com.example@gmail.com", "123456");
        em.persist(signinUser);

        mockMvc.perform(post("/api/user/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signinUser)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.userId").value(signinUser.getUserId()))
            .andExpect(jsonPath("$.name").value(signinUser.getName()))
            .andExpect(jsonPath("$.gender").value(signinUser.getGender()))
            .andExpect(jsonPath("$.age").value(signinUser.getAge()))
            .andExpect(jsonPath("$.email").value(signinUser.getEmail()))
            .andExpect(jsonPath("$.password").value(signinUser.getPassword()));

        User signedinUser = em.find(User.class, signinUser.getUserId());
        Assert.notNull(signedinUser, "User not found in the database");
        Assert.isTrue(signedinUser.getName().equals(signinUser.getName()), "User name does not match");
        Assert.isTrue(signedinUser.getGender().equals(signinUser.getGender()), "User gender does not match");
        Assert.isTrue(signedinUser.getAge() == signinUser.getAge(), "User age does not match");
        Assert.isTrue(signedinUser.getEmail().equals(signinUser.getEmail()), "User email does not match");
        Assert.isTrue(signedinUser.getPassword().equals(signinUser.getPassword()), "User password does not match");
    }

    @Test
    void testRegister() throws Exception {
        
        User createdUser = new User("testRegister", "men", 18, "com.example@gmail.com", "123456");
       
        MvcResult result = mockMvc.perform(post("/api/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createdUser)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value(createdUser.getName()))
            .andExpect(jsonPath("$.gender").value(createdUser.getGender()))
            .andExpect(jsonPath("$.email").value(createdUser.getEmail()))
            .andExpect(jsonPath("$.age").value(createdUser.getAge()))
            .andExpect(jsonPath("$.password").value(createdUser.getPassword()))
            .andReturn();

        Map<String, String> response = objectMapper.readValue(result.getResponse().getContentAsString(), Map.class);
        String userId = (String) response.get("userId");
        String name = (String) response.get("name");
        String gender = (String) response.get("gender");
        String email = (String) response.get("email");
        String password = (String) response.get("password");
        Object ageObj = response.get("age");
        String ageStr = String.valueOf(ageObj);
        Integer age = Integer.valueOf((ageStr));

        User registeredUser = em.find(User.class, userId);
        Assert.notNull(registeredUser, "User not found in the database");
        Assert.isTrue(name.equals(createdUser.getName()), "User name does not match");
        Assert.isTrue(age == createdUser.getAge(), "User age does not match");
        Assert.isTrue(gender.equals(createdUser.getGender()), "User gender does not match");
        Assert.isTrue(email.equals(createdUser.getEmail()), "User email does not match");
        Assert.isTrue(password.equals(createdUser.getPassword()), "User password does not match");
    }

    @Test
    void testUpdate() throws Exception {
       
        User certainUser = new User("testUpdate_before", "men", 18, "com.example.before@gmail.com", "123456");
        User updatedUser = new User("testUpdate_after", "women", 20, "com.example.after@gmail.com", "654321");

        em.persist(certainUser);

        mockMvc.perform(put("/api/user/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
            .andExpect(status().isOk());

        User updatedCertainUser = em.find(User.class, updatedUser.getUserId());
        Assert.notNull(updatedCertainUser, "User not found in the database");
        Assert.isTrue(updatedCertainUser.getName().equals(updatedUser.getName()), "User name does not match");
        Assert.isTrue(updatedCertainUser.getGender().equals(updatedUser.getGender()), "User gender does not match");
        Assert.isTrue(updatedCertainUser.getAge() == updatedUser.getAge(), "User age does not match");
        Assert.isTrue(updatedCertainUser.getEmail().equals(updatedUser.getEmail()), "User email does not match");
        Assert.isTrue(updatedCertainUser.getPassword().equals(updatedUser.getPassword()), "User password does not match");
    }

    @Test
    void testDelete() throws Exception {
        
        User deletedUser = new User("testDelete", "men", 18, "com.example@gmail.com", "123456");

        if (em.find(User.class, deletedUser.getUserId()) == null) {
            em.persist(deletedUser);
        }

        mockMvc.perform(delete("/api/user/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(deletedUser)))
            .andExpect(status().isOk());

        Assert.isNull(em.find(User.class, deletedUser.getUserId()), "User not deleted from the database");
    }
}
