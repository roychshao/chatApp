package com.example.chatApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.chatApp")
@EntityScan(basePackages = "com.example.chatApp.domain")
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

}
