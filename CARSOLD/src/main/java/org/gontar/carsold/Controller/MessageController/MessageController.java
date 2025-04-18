package org.gontar.carsold.Controller.MessageController;

import org.gontar.carsold.Domain.Model.Message.ConversationDto;
import org.gontar.carsold.Domain.Model.Message.SentMessageDto;
import org.gontar.carsold.Domain.Model.Message.UnseenMessagesCountDto;
import org.gontar.carsold.Domain.Model.Message.ConversationWithUserDto;
import org.gontar.carsold.Domain.Model.Universal.SingleStringDto;
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

    @PostMapping("/activateConversation")
    public ResponseEntity<?> activateConversation(@RequestBody SingleStringDto username) {
        service.activateConversation(username.getValue());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody SentMessageDto sentMessageDto) {
        service.sendMessage(
                sentMessageDto.getSenderUsername(),
                sentMessageDto.getReceiverUsername(),
                sentMessageDto.getContent());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/getUnseenCount")
    public ResponseEntity<UnseenMessagesCountDto> getUnseenCount() {
        return ResponseEntity.ok(service.getUnseenCount());
    }

    @GetMapping("/getAllConversations")
    public ResponseEntity<List<ConversationDto>> getAllConversations() {
        List<ConversationDto> userConversations = service.getAllConversations();
        return ResponseEntity.ok(userConversations);
    }

    @GetMapping("/getConversationOnInitial/{username}")
    public ResponseEntity<ConversationWithUserDto> getConversationOnInitial(@PathVariable String username) {
        ConversationWithUserDto conversation = service.getConversationOnInitial(username);
        return ResponseEntity.ok(conversation);
    }

    @DeleteMapping("/deleteConversation/{username}")
    public ResponseEntity<?> deleteConversation(@PathVariable String username) {
        service.deleteConversation(username);
        return ResponseEntity.ok().build();
    }
}
