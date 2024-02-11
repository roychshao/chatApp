package com.example.chatApp.controller;

import com.example.chatApp.domain.Chatroom;
import org.springframework.web.bind.annotation.*;
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
    public ResponseEntity<Chatroom> register(@RequestBody Chatroom createChatroom) {
        
        Chatroom newChatroom = new Chatroom(createChatroom.getUsers());

        try {
            
            em.persist(newChatroom);

            System.out.println("Chatroom " + newChatroom.getId() + " created");
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

            System.out.println("Chatroom " + updatedChatroom.getId() + " updated");
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

            System.out.println("Chatroom " + deletedChatroom.getId() + " deleted");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok().build();
    }
}
