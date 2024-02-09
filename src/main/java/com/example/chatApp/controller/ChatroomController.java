package com.example.chatApp.controller;

import com.example.chatApp.domain.Chatroom;
import com.example.chatApp.util.hibernateUtil;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.hibernate.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/chatroom")
public class ChatroomController {

    @Autowired
    private SessionFactory factory = hibernateUtil.getSessionFactory();

    public ChatroomController() {
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<Chatroom> getChatroomById(@PathVariable String roomId) {

        try (Session session = factory.openSession()) {

            session.beginTransaction();
            Chatroom chatroom = session.get(Chatroom.class, roomId);
            session.getTransaction().commit();
            session.close();

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

    @PostMapping("/create")
    public ResponseEntity<Chatroom> register(@RequestBody Chatroom createChatroom) {
        
        Chatroom newChatroom = new Chatroom(createChatroom.getUsers());

        try (Session session = factory.openSession()) {
            
            session.beginTransaction();
            session.persist(newChatroom);
            session.getTransaction().commit();
            session.close();

            System.out.println("Chatroom " + newChatroom.getId() + " created");
            return ResponseEntity.ok(newChatroom);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("/update")
    public ResponseEntity<Void> updateChatroom(@RequestBody Chatroom updatedChatroom) {
        
        try (Session session = factory.openSession()) {
            
            session.beginTransaction();
            session.merge(updatedChatroom);
            session.getTransaction().commit();
            session.close();

            System.out.println("Chatroom " + updatedChatroom.getId() + " updated");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteChatroom(@RequestBody Chatroom deletedChatroom) {

        try (Session session = factory.openSession()) {

            session.beginTransaction();
            session.merge(deletedChatroom);
            session.remove(deletedChatroom);
            session.getTransaction().commit();
            session.close();

            System.out.println("Chatroom " + deletedChatroom.getId() + " deleted");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok().build();
    }
}
