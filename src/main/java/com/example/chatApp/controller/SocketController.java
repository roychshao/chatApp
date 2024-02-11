package com.example.chatApp.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.chatApp.domain.Message;
import com.example.chatApp.config.hibernateConfig;
import org.hibernate.*;


@Controller
public class SocketController {

    private final SessionFactory factory;

    @Autowired
    public SocketController(SessionFactory factory) {
        this.factory = factory;
    }

    @MessageMapping("/socket")
    @SendTo("/topic/{chatroomId}/messages")
    public Message messageHandler(@DestinationVariable String chatroomId, Message msg) {
        
        try (Session session = factory.openSession()) {

            session.beginTransaction();
            session.persist(msg);
            session.getTransaction().commit();
            session.close();

            System.out.println("Message " + msg.getId() + " stored");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return msg;
    }
}
