package com.example.chatApp.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.stereotype.Controller;
import com.example.chatApp.domain.Message;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Controller
public class SocketController {

    @PersistenceContext
    private EntityManager em;

    public SocketController() {
    }

    @Transactional
    @MessageMapping("/socket")
    @SendTo("/topic/{chatroomId}/messages")
    public Message messageHandler(@DestinationVariable String chatroomId, Message msg) {
        
        try {

            em.persist(msg);

            System.out.println("Message " + msg.getId() + " stored");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return msg;
    }
}
