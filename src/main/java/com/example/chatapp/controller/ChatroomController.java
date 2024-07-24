package com.example.chatapp.controller;

import com.example.chatapp.domain.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatroom")
public class ChatroomController {
    @PersistenceContext
    private EntityManager em;

    private static final Logger logger = LoggerFactory.getLogger(
        ChatroomController.class
    );

    public ChatroomController() {
        // nothing need to do in the non-argument constructor
    }

    @Transactional
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Chatroom>> getUserChatrooms(
        @PathVariable String userId
    ) {
        try {
            String hql =
                "SELECT c FROM Chatroom c INNER JOIN c.users u WHERE u.userId = :userId";
            List<Chatroom> chatrooms = em
                .createQuery(hql, Chatroom.class)
                .setParameter("userId", userId)
                .getResultList();

            for (Chatroom chatroom : chatrooms) {
                List<User> users = chatroom.getUsers();
                if (users.size() == 2) {
                    String roomName = "";
                    if (userId.equals(users.get(0).getUserId())) {
                        roomName = users.get(1).getName();
                    } else {
                        roomName = users.get(0).getName();
                    }
                    chatroom.setRoomName(roomName);
                }
            }

            return ResponseEntity.ok(chatrooms);
        } catch (Exception e) {
            logger.error("getUserChatrooms:", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Transactional
    @GetMapping("/{roomId}")
    public ResponseEntity<Chatroom> getChatroomById(
        @PathVariable String roomId
    ) {
        try {
            Chatroom chatroom = em.find(Chatroom.class, roomId);

            if (chatroom != null) {
                return ResponseEntity.ok(chatroom);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            logger.error("getChatroomById:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }
    }

    @Transactional
    @PostMapping("/create")
    public ResponseEntity<Chatroom> createChatroom(
        @RequestBody Chatroom createdChatroom
    ) {
        Chatroom newChatroom = new Chatroom(
            createdChatroom.getRoomName(),
            createdChatroom.getUsers(),
            createdChatroom.getMessages()
        );

        try {
            List<User> newUsers = newChatroom.getUsers();
            for (User user : newUsers) {
                User tmp = em.find(User.class, user.getUserId());
                if (tmp == null) {
                    throw new NullPointerException(
                        "User " + user.getUserId() + " does not exist."
                    );
                }
            }
            newChatroom.setUsers(newUsers);

            em.persist(newChatroom);

            return ResponseEntity.ok(newChatroom);
        } catch (Exception e) {
            logger.error("createChatroom:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }
    }

    @Transactional
    @PutMapping("/update")
    public ResponseEntity<Void> updateChatroom(
        @RequestBody Chatroom updatedChatroom
    ) {
        try {
            em.merge(updatedChatroom);
        } catch (Exception e) {
            logger.error("updateChatroom:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }

        return ResponseEntity.ok().build();
    }

    @Transactional
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteChatroom(
        @RequestBody Chatroom deletedChatroom
    ) {
        try {
            Chatroom chatroomToDelete = em.find(
                Chatroom.class,
                deletedChatroom.getRoomId()
            );
            em.remove(chatroomToDelete);
        } catch (Exception e) {
            logger.error("deleteChatroom:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }

        return ResponseEntity.ok().build();
    }
}
