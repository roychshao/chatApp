package com.example.chatapp.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserTest {
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
    }

    @Test
    void testHashEmail() {
        String email = "test@example.com";
        String hashedEmail = user.hashEmail(email);
        assertNotNull(hashedEmail);
        assertNotEquals(email, hashedEmail);
    }

    @Test
    void testGetAndSetName() {
        String name = "Test User";
        user.setName(name);
        assertEquals(name, user.getName());
    }

    @Test
    void testGetAndSetAge() {
        int age = 25;
        user.setAge(age);
        assertEquals(age, user.getAge());
    }

    @Test
    void testGetAndSetGender() {
        String gender = "Male";
        user.setGender(gender);
        assertEquals(gender, user.getGender());
    }

    @Test
    void testGetAndSetEmail() {
        String email = "test@example.com";
        user.setEmail(email);
        assertEquals(email, user.getEmail());
    }

    @Test
    void testGetAndSetPassword() {
        String password = "password123";
        user.setPassword(password);
        assertEquals(password, user.getPassword());
    }

    @Test
    void testGetAndSetUserId() {
        String userId = "user123";
        user.setUserId(userId);
        assertEquals(userId, user.getUserId());
    }
}
