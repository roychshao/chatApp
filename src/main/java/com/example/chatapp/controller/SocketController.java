package com.example.chatapp.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.stereotype.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.Date;
import java.util.concurrent.CompletableFuture;

import com.example.chatapp.domain.*;

import jakarta.persistence.PersistenceContext;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import org.testcontainers.ollama.OllamaContainer;
import org.testcontainers.utility.DockerImageName;

@Controller
public class SocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    private static final Logger logger = LoggerFactory.getLogger(SocketController.class);

    public static String MODEL_NAME = "orca-mini";

    public static String DOCKER_IMAGE_NAME = "langchain4j/ollama-" + MODEL_NAME + ":latest";

    public static OllamaContainer ollama = new OllamaContainer(
        DockerImageName.parse(DOCKER_IMAGE_NAME).asCompatibleSubstituteFor("ollama/ollama")
    );


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

            // if ask ai
            if (message.getToUser().getUserId().equals(message.getFromUser().getUserId() + "-assistant")) {

                System.out.println("asking ai...");
                // generate ai answer
                ChatLanguageModel model = OllamaChatModel.builder()
                .baseUrl(ollama.getEndpoint())
                .modelName(MODEL_NAME)
                .timeout(Duration.ofSeconds(60))
                .build();

                String answer = model.generate(msg.getContent());
                System.out.println(answer);
                Message response = new Message(answer, msg.getChatroom(), msg.getToUser(), msg.getFromUser(), new Date());
                em.persist(response);
                simpMessagingTemplate.convertAndSend("/topic/" + roomId + "/messages", response);
            }

        } catch (Exception e) {
            logger.error("messageHandler:", e);
        }
    }
}
