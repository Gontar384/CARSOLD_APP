package org.gontar.carsold.Service.MessageService;

import org.gontar.carsold.Domain.Entity.Message.Message;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.ReceivedMessageDto;
import org.gontar.carsold.Exception.CustomException.MessageTooLargeException;
import org.gontar.carsold.Exception.CustomException.UserNotFoundException;
import org.gontar.carsold.Repository.MessageRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.WebSocketService.WebSocketService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;
    private final MyUserDetailsService userDetailsService;

    public MessageServiceImpl(MessageRepository messageRepository, UserRepository userRepository, WebSocketService webSocketService, MyUserDetailsService userDetailsService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.webSocketService = webSocketService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void sendMessage(String senderUsername, String receiverUsername, String content) {
        Objects.requireNonNull(senderUsername, "Sender username cannot be null");
        Objects.requireNonNull(receiverUsername, "Receiver username cannot be null");
        Objects.requireNonNull(content, "Content cannot be null");

        User sender = userRepository.findByUsername(senderUsername);
        if (sender == null) throw new UserNotFoundException("Sender not found");
        User receiver = userRepository.findByUsername(receiverUsername);
        if (receiver == null) throw new UserNotFoundException("Receiver not found");

        if (content.length() > 1000) throw new MessageTooLargeException("Message is too long");

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());

        messageRepository.save(message);

        ReceivedMessageDto dto = new ReceivedMessageDto();
        dto.setSenderUsername(message.getSender().getUsername());
        dto.setReceiverUsername(message.getReceiver().getUsername());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        dto.setSeen(message.isSeen());

        webSocketService.sendMessageToUser(message.getReceiver().getUsername(), dto);
    }

    @Override
    public List<ReceivedMessageDto> getUnseenMessages() {
        User user = userDetailsService.loadUser();
        List<Message> unseenMessages = messageRepository
                .findByReceiverUsernameAndSeenFalseOrderByTimestampDesc(user.getUsername());

        return unseenMessages.stream()
                .map(message -> {
                    ReceivedMessageDto dto = new ReceivedMessageDto();
                    dto.setSenderUsername(message.getSender().getUsername());
                    dto.setReceiverUsername(message.getReceiver().getUsername());
                    dto.setContent(message.getContent());
                    dto.setTimestamp(message.getTimestamp());
                    dto.setSeen(message.isSeen());
                    return dto;
                })
                .toList();
    }
}
