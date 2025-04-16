package org.gontar.carsold.Controller.MessageController;

import org.gontar.carsold.Domain.Model.Message.ConversationDto;
import org.gontar.carsold.Domain.Model.Message.SentMessageDto;
import org.gontar.carsold.Domain.Model.Message.UnseenMessagesDto;
import org.gontar.carsold.Domain.Model.Message.WholeConversationDto;
import org.gontar.carsold.Service.MessageService.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    private final MessageService service;

    public MessageController(MessageService service) {
        this.service = service;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody SentMessageDto sentMessageDto) {
        service.sendMessage(
                sentMessageDto.getSenderUsername(),
                sentMessageDto.getReceiverUsername(),
                sentMessageDto.getContent());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/getUnseen")
    public ResponseEntity<UnseenMessagesDto> getUnseenMessages() {
        return ResponseEntity.ok(service.getUnseenMessages());
    }

    @GetMapping("/getUserConversations")
    public ResponseEntity<List<ConversationDto>> getUserConversations() {
        List<ConversationDto> userConversations = service.getUserConversations();
        return ResponseEntity.ok(userConversations);
    }

    @GetMapping("/getConversation/{username}")
    public ResponseEntity<WholeConversationDto> getConversation(@PathVariable String username,
                                                                @RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size) {
        WholeConversationDto conversation = service.getConversation(username, page, size);
        return ResponseEntity.ok(conversation);
    }
}
