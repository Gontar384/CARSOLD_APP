package org.gontar.carsold.Controller.MessageController;

import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Domain.Entity.Message.Message;
import org.gontar.carsold.Domain.Model.MessageDto;
import org.gontar.carsold.Service.MessageService.MessageService;
import org.gontar.carsold.Service.WebSocketService.WebSocketService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/messages")
@Validated
public class MessageController {

    private final MessageService messageService;
    private final Mapper<Message, MessageDto> mapper;
    private final WebSocketService webSocketService;

    public MessageController(MessageService messageService, Mapper<Message, MessageDto> mapper, WebSocketService webSocketService) {
        this.messageService = messageService;
        this.mapper = mapper;
        this.webSocketService = webSocketService;
    }

    @PostMapping("/send")
    public ResponseEntity<MessageDto> sendMessage(@RequestBody MessageDto messageDto) {
        Message message = mapper.mapToEntity(messageDto);
        Message savedMessage = messageService.sendMessage(message);
        MessageDto savedMessageDto = mapper.mapToDto(savedMessage);
        webSocketService.sendMessageToUser(savedMessageDto.getReceiverUsername(), savedMessageDto);

        return ResponseEntity.ok(savedMessageDto);
    }
}
