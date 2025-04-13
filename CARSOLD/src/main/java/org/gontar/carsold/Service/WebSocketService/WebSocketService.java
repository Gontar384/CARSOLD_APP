package org.gontar.carsold.Service.WebSocketService;

import org.gontar.carsold.Domain.Model.ReceivedMessageDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendMessageToUser(String username, ReceivedMessageDto receivedMessageDto) {
        messagingTemplate.convertAndSend("/topic/messages/" + username, receivedMessageDto);
    }
}