package com.example.chatapp.config;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

class WebSocketConfigTest {
    private WebSocketConfig webSocketConfig = new WebSocketConfig();

    @Test
    void configureMessageBrokerTest() {
        MessageBrokerRegistry messageBrokerRegistry = Mockito.mock(
            MessageBrokerRegistry.class
        );
        webSocketConfig.configureMessageBroker(messageBrokerRegistry);
        Mockito
            .verify(messageBrokerRegistry, Mockito.times(1))
            .enableSimpleBroker("/topic");
        Mockito
            .verify(messageBrokerRegistry, Mockito.times(1))
            .setApplicationDestinationPrefixes("");
    }

    @Test
    void registerStompEndpointsTest() {
        StompEndpointRegistry stompEndpointRegistry = Mockito.mock(
            StompEndpointRegistry.class
        );
        webSocketConfig.registerStompEndpoints(stompEndpointRegistry);
        Mockito
            .verify(stompEndpointRegistry, Mockito.times(1))
            .addEndpoint("/chatApp");
    }
}
