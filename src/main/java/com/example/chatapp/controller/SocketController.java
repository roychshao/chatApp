package com.example.chatapp.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.stereotype.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.chatapp.domain.*;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Controller
public class SocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    
    private static final Logger logger = LoggerFactory.getLogger(SocketController.class);

    @PersistenceContext
    private EntityManager em;

    @Autowired
    public SocketController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Transactional
    @MessageMapping("/socket/{roomId}/messages")
    public void messageHandler(@DestinationVariable String roomId, Message msg) {
        try {

            Message message = new Message(msg.getContent(), msg.getChatroom(), msg.getFromUser(), msg.getToUser(), msg.getTime());
            em.persist(message);
            simpMessagingTemplate.convertAndSend("/topic/" + roomId + "/messages", message);
        } catch (Exception e) {
            logger.error("messageHandler:", e);
        }
    }
}
