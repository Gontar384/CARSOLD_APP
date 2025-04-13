package org.gontar.carsold.Controller.MessageController;

import org.gontar.carsold.Domain.Model.SentMessageDto;
import org.gontar.carsold.Service.MessageService.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody SentMessageDto sentMessageDto) {
        messageService.sendMessage(
                sentMessageDto.getSenderUsername(),
                sentMessageDto.getReceiverUsername(),
                sentMessageDto.getContent());

        return ResponseEntity.ok().build();
    }
}
