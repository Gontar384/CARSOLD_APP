package org.gontar.carsold.Service.MessageService;

import org.gontar.carsold.Domain.Entity.Message.Conversation;
import org.gontar.carsold.Domain.Entity.Message.Message;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.Message.*;
import org.gontar.carsold.Exception.CustomException.ConversationNotFoundException;
import org.gontar.carsold.Exception.CustomException.MessageTooLargeException;
import org.gontar.carsold.Exception.CustomException.UserNotFoundException;
import org.gontar.carsold.Exception.CustomException.WrongActionException;
import org.gontar.carsold.Repository.ConversationRepository;
import org.gontar.carsold.Repository.MessageRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.WebSocketService.WebSocketService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;
    private final MyUserDetailsService userDetailsService;

    public MessageServiceImpl(ConversationRepository conversationRepository, MessageRepository messageRepository, UserRepository userRepository, WebSocketService webSocketService, MyUserDetailsService userDetailsService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.webSocketService = webSocketService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void activateConversation(String username) {
        Objects.requireNonNull(username, "Username cannot be null");
        User user = userDetailsService.loadUser();
        User otherUser = userRepository.findByUsername(username);
        if (otherUser == null) throw new UserNotFoundException("User not found");
        if (user.getUsername().equals(username)) throw new WrongActionException("You cannot start a conversation with yourself");

        Conversation conversation = conversationRepository
                .findByUsers(user.getId(), otherUser.getId())
                .orElseGet(() -> {
                    Conversation newConv = new Conversation();
                    newConv.setUser1(user);
                    newConv.setUser2(otherUser);
                    return conversationRepository.save(newConv);
                });

        if (conversation.getUser1().getId().equals(user.getId())) {
            conversation.setActivatedByUser1(true);
        } else if (conversation.getUser2().getId().equals(user.getId())) {
            conversation.setActivatedByUser2(true);
        }
        conversationRepository.save(conversation);
    }

    @Override
    public void sendMessage(String senderUsername, String receiverUsername, String content) {
        Objects.requireNonNull(senderUsername, "Sender username cannot be null");
        Objects.requireNonNull(receiverUsername, "Receiver username cannot be null");
        Objects.requireNonNull(content, "Content cannot be null");
        if (content.length() > 1000) throw new MessageTooLargeException("Message is too long");

        User sender = userRepository.findByUsername(senderUsername);
        if (sender == null) throw new UserNotFoundException("Sender not found");
        if (senderUsername.equals(receiverUsername)) throw new WrongActionException("You cannot have a conversation with yourself");
        User receiver = userRepository.findByUsername(receiverUsername);
        if (receiver == null) throw new UserNotFoundException("Receiver not found");

        Conversation conversation = conversationRepository
                .findByUsers(sender.getId(), receiver.getId())
                .orElseGet(() -> {
                    Conversation newConv = new Conversation();
                    newConv.setUser1(sender);
                    newConv.setUser2(receiver);
                    return conversationRepository.save(newConv);
                });

        conversation.setActivatedByUser1(true);
        conversation.setActivatedByUser2(true);

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message.setConversation(conversation);

        if (conversation.getUser1().getId().equals(sender.getId())) {
            conversation.setSeenByUser1(true);
            conversation.setSeenByUser2(false);
        } else {
            conversation.setSeenByUser1(false);
            conversation.setSeenByUser2(true);
        }

        messageRepository.save(message);
        conversationRepository.save(conversation);

        NotificationDto dto = new NotificationDto();
        dto.setSenderUsername(sender.getUsername());
        dto.setSenderProfilePic(sender.getProfilePic());
        dto.setContent(content);
        dto.setTimestamp(message.getTimestamp());

        webSocketService.sendMessageToUser(receiver.getUsername(), dto);
    }

    @Override
    public UnseenMessagesCountDto getUnseenCount() {
        User user = userDetailsService.loadUser();
        int countAsUser1 = conversationRepository.countUnseenAndActivatedByUser1(user.getId());
        int countAsUser2 = conversationRepository.countUnseenAndActivatedByUser2(user.getId());
        int totalUnseenConversations = countAsUser1 + countAsUser2;
        return new UnseenMessagesCountDto(totalUnseenConversations);
    }

    @Override
    public List<ConversationDto> getAllConversations() {
        User user = userDetailsService.loadUser();
        Long userId = user.getId();

        List<Conversation> conversations = conversationRepository.findActivatedConversationsForUser(user);

        return conversations.stream()
                .map(conversation -> {
                    User otherUser = conversation.getUser1().getId().equals(userId)
                            ? conversation.getUser2()
                            : conversation.getUser1();
                    Message latestMessage = conversation.getMessages().stream()
                            .max(Comparator.comparing(Message::getTimestamp))
                            .orElse(null);
                    return new ConversationDto(
                            otherUser.getUsername(),
                            otherUser.getProfilePic(),
                            latestMessage != null ? latestMessage.getContent() : "",
                            latestMessage != null ? latestMessage.getTimestamp() : null,
                            latestMessage != null ? latestMessage.getSender().getUsername() : null
                    );
                })
                .sorted(Comparator.comparing(ConversationDto::getTimestamp, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @Override
    public ConversationWithUserDto getConversationOnInitial(String username) {
        Objects.requireNonNull(username, "Username cannot be null");
        User user = userDetailsService.loadUser();
        User otherUser = userRepository.findByUsername(username);

        if (otherUser == null) throw new UserNotFoundException("User not found");
        if (user.getUsername().equals(username)) throw new WrongActionException("You cannot have a conversation with yourself");

        Conversation conversation = conversationRepository
                .findByUsers(user.getId(), otherUser.getId())
                .orElseThrow(() -> new ConversationNotFoundException("Conversation not found"));

        boolean isUser1 = conversation.getUser1().getId().equals(user.getId());
        boolean isActivatedForUser = isUser1 ? conversation.isActivatedByUser1() : conversation.isActivatedByUser2();

        if (!isActivatedForUser) {
            throw new ConversationNotFoundException("Conversation is not activated for this user");
        }

        List<MessageDto> messageDtos = conversation.getMessages().stream()
                .sorted(Comparator.comparing(Message::getTimestamp).reversed())
                .limit(15)
                .map(m -> new MessageDto(
                        m.getContent(),
                        m.getTimestamp(),
                        m.getSender().getUsername()))
                .collect(Collectors.toList());

        return new ConversationWithUserDto(
                otherUser.getUsername(),
                otherUser.getProfilePic(),
                messageDtos
        );
    }
}
