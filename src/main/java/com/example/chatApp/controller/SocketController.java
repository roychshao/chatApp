package com.example.chatApp.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;
import com.example.chatApp.domain.Message;
import com.example.chatApp.util.hibernateUtil;
import org.hibernate.*;


@Controller
public class SocketController {

    @Autowired
    private SessionFactory factory = hibernateUtil.getSessionFactory();

    public SocketController() {
    }

    @MessageMapping("/socket")
    @SendTo("/topic/{chatroomId}/messages")
    public Message messageHandler(@DestinationVariable String chatroomId, Message msg) {
        
        try (Session session = factory.openSession()) {

            session.beginTransaction();
            session.save(msg);
            session.getTransaction().commit();
            session.close();

            System.out.println("Message " + msg.getId() + " stored");
            return msg;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
