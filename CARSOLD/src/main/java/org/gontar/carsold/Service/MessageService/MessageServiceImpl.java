package org.gontar.carsold.Service.MessageService;

import org.gontar.carsold.Domain.Entity.Message.Message;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.Message.*;
import org.gontar.carsold.Exception.CustomException.MessageTooLargeException;
import org.gontar.carsold.Exception.CustomException.UserNotFoundException;
import org.gontar.carsold.Exception.CustomException.WrongActionException;
import org.gontar.carsold.Repository.MessageRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.WebSocketService.WebSocketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


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

        NotificationMessageDto dto = new NotificationMessageDto();
        dto.setSenderUsername(message.getSender().getUsername());
        dto.setSenderProfilePic(message.getSender().getProfilePic());
        dto.setContent(message.getContent());

        webSocketService.sendMessageToUser(message.getReceiver().getUsername(), dto);
    }

    @Override
    public UnseenMessagesDto getUnseenMessages() {
        User user = userDetailsService.loadUser();
        int unseenCount = messageRepository.countByReceiverUsernameAndSeenFalse(user.getUsername());
        return new UnseenMessagesDto(unseenCount);
    }

    @Override
    public List<ConversationDto> getUserConversations() {
        User user = userDetailsService.loadUser();
        Long userId = user.getId();

        List<Message> latestMessages = messageRepository.findLastMessagesForEachConversation(userId);

        return latestMessages.stream()
                .map(message -> {
                    User otherUser = message.getSender().getId().equals(userId)
                            ? message.getReceiver()
                            : message.getSender();

                    return new ConversationDto(
                            otherUser.getUsername(),
                            otherUser.getProfilePic(),
                            message.getContent(),
                            message.getTimestamp(),
                            message.getReceiver().getId().equals(userId) && !message.isSeen()
                    );
                })
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .toList();
    }

    @Override
    public WholeConversationDto getConversation(String username, int page, int size) {
        Objects.requireNonNull(username, "Username cannot be null");
        User user = userDetailsService.loadUser();
        User otherUser = userRepository.findByUsername(username);
        if (otherUser == null) throw new UserNotFoundException("User not found");
        if (user.getUsername().equals(username)) throw new WrongActionException("You cannot have conversation with yourself");

        Pageable pageable = PageRequest.of(Math.max(page, 0), size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<Message> messagesPage = messageRepository.findConversationBetweenUsers(user, otherUser, pageable);

        List<PartialMessageDto> messageDtos = messagesPage
                .stream()
                .map(m -> new PartialMessageDto(m.getContent(), m.getTimestamp(), m.isSeen()))
                .collect(Collectors.toList());

        return new WholeConversationDto(otherUser.getUsername(), otherUser.getProfilePic(), messageDtos);
    }
}
