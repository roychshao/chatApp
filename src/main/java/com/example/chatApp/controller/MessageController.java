package com.example.chatApp.controller;

import com.example.chatApp.domain.Message;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    @PersistenceContext
    private EntityManager em;

    public MessageController() {
    }

    @Transactional
    @GetMapping("/{roomId}/recentfifty")
    public ResponseEntity<List<Message>> getRecentFiftyMessage(@PathVariable String roomId) {
        
        try {
            String hql = "SELECT m FROM Message m WHERE m.chatroom.roomId = : roomId ORDER BY m.time DESC";
            List<Message> messages = em.createQuery(hql, Message.class)
                .setParameter("roomId", roomId)
                .setMaxResults(50)
                .getResultList();
            
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
