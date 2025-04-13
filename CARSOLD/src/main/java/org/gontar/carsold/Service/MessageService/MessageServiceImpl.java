package org.gontar.carsold.Service.MessageService;

import org.gontar.carsold.Domain.Entity.Message.Message;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Exception.CustomException.MessageTooLargeException;
import org.gontar.carsold.Exception.CustomException.UserNotFoundException;
import org.gontar.carsold.Repository.MessageRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.WebSocketService.WebSocketService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;

    public MessageServiceImpl(MessageRepository messageRepository, UserRepository userRepository, WebSocketService webSocketService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.webSocketService = webSocketService;
    }

    @Override
    public Message sendMessage(String senderUsername, String receiverUsername, String content) {
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

        return messageRepository.save(message);
    }
}
