package com.example.chatApp.controller;

import com.example.chatApp.domain.Message;
import com.example.chatApp.util.hibernateUtil;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.hibernate.*;
import org.hibernate.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    @Autowired
    private SessionFactory factory = hibernateUtil.getSessionFactory();

    public MessageController() {
    }

    @GetMapping("/{}")
}
