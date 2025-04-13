package org.gontar.carsold.Service.WebSocketService;

import org.gontar.carsold.Domain.Entity.Message.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendMessageToUser(String username, Message message) {
        messagingTemplate.convertAndSend("/topic/messages/" + username, message);
    }
}