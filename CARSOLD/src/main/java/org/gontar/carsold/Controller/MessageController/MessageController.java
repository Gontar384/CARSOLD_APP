package org.gontar.carsold.Controller.MessageController;

import org.gontar.carsold.Domain.Model.Message.*;
import org.gontar.carsold.Domain.Model.Universal.SingleStringDto;
import org.gontar.carsold.Service.MessageService.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MessageController {

    private final MessageService service;

    public MessageController(MessageService service) {
        this.service = service;
    }

    @PostMapping("/private/message/activateConversation")
    public ResponseEntity<?> activateConversation(@RequestBody SingleStringDto username) {
        service.activateConversation(username.getValue());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/private/message/send")
    public ResponseEntity<?> sendMessage(@RequestBody SentMessageDto sentMessageDto) {
        service.sendMessage(sentMessageDto.getReceiverUsername(), sentMessageDto.getContent());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/private/message/getUnseenCount")
    public ResponseEntity<UnseenMessagesCountDto> getUnseenCount() {
        return ResponseEntity.ok(service.getUnseenCount());
    }

    @GetMapping("/private/message/getAllConversations")
    public ResponseEntity<List<ConversationDto>> getAllConversations() {
        List<ConversationDto> userConversations = service.getAllConversations();
        return ResponseEntity.ok(userConversations);
    }

    @GetMapping("/private/message/getConversationOnInitial/{username}")
    public ResponseEntity<ConversationWithUserDto> getConversationOnInitial(@PathVariable String username) {
        ConversationWithUserDto conversation = service.getConversationOnInitial(username);
        return ResponseEntity.ok(conversation);
    }

    @DeleteMapping("/private/message/deleteConversation/{username}")
    public ResponseEntity<?> deleteConversation(@PathVariable String username) {
        service.deleteConversation(username);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/private/message/blockUnblockUser/{username}")
    public ResponseEntity<?> blockUnblockUser(@PathVariable String username) {
        service.blockUnblockUser(username);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/private/message/makeSeen/{username}")
    public ResponseEntity<?> makeSeen(@PathVariable String username) {
        service.makeSeen(username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/private/message/getPreviousMessages/{username}/{page}")
    public ResponseEntity<PagedMessagesDto> getPreviousMessages(@PathVariable String username, @PathVariable int page) {
        PagedMessagesDto olderMessages = service.getPreviousMessages(username, page);
        return ResponseEntity.ok(olderMessages);
    }
}
