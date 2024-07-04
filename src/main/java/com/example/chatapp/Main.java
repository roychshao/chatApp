package com.example.chatapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

import org.testcontainers.ollama.OllamaContainer;
import com.example.chatapp.controller.SocketController;

import jakarta.annotation.PreDestroy;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.chatapp")
@EntityScan(basePackages = "com.example.chatapp.domain")
public class Main {

    static OllamaContainer ollama = SocketController.ollama;

    public static void main(String[] args) {
        ollama.start();
        SpringApplication.run(Main.class, args);
    }

    @PreDestroy
    public void CloseOllama() {
        ollama.stop();
    }
}
