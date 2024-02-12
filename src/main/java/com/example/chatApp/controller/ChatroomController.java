package com.example.chatApp.controller;

import com.example.chatApp.domain.Chatroom;
import org.springframework.web.bind.annotation.*;

import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.ArrayList;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.BeanUtils;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/chatroom")
public class ChatroomController {
    
    @PersistenceContext
    private EntityManager em;

    public ChatroomController() {
    }

    @Transactional
    @GetMapping("/{userId}")
    public ResponseEntity<List<Chatroom>> getUserChatrooms(@PathVariable String userId) {

        try {
            String hql = "FROM Chatroom c INNER JOIN CHATROOM_USER cu ON c.roomId = cu.roomId INNER JOIN USER u ON cu.userId = u.userId WHERE u.id = :userId;";
            List<Chatroom> chatrooms = em.createQuery(hql, Chatroom.class)
                .setParameter("userId", userId)
                .getResultList();

            return ResponseEntity.ok(chatrooms);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Transactional
    @GetMapping("/{roomId}")
    public ResponseEntity<Chatroom> getChatroomById(@PathVariable String roomId) {

        try {

            Chatroom chatroom = em.find(Chatroom.class, roomId);

            if (chatroom != null) {
                return ResponseEntity.ok(chatroom);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Transactional
    @PostMapping("/create")
    public ResponseEntity<Chatroom> createChatroom(@RequestBody Chatroom createdChatroom) {

        Chatroom newChatroom = new Chatroom(createdChatroom.getUsers(), createdChatroom.getMessages());

        try {
            
            em.persist(newChatroom);

            return ResponseEntity.ok(newChatroom);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @Transactional
    @PutMapping("/update")
    public ResponseEntity<Void> updateChatroom(@RequestBody Chatroom updatedChatroom) {
        
        try {
            
            em.merge(updatedChatroom);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok().build();
    }

    @Transactional
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteChatroom(@RequestBody Chatroom deletedChatroom) {

        try {

            em.merge(deletedChatroom);
            em.remove(deletedChatroom);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok().build();
    }
}
