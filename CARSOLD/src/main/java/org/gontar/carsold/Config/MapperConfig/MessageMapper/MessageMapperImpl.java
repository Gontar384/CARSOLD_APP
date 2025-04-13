package org.gontar.carsold.Config.MapperConfig.MessageMapper;

import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Domain.Entity.Message.Message;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.MessageDto;
import org.gontar.carsold.Exception.CustomException.UserNotFoundException;
import org.gontar.carsold.Repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class MessageMapperImpl implements Mapper<Message, MessageDto> {

    private final ModelMapper mapper;
    private final UserRepository userRepository;

    public MessageMapperImpl(ModelMapper mapper, UserRepository userRepository) {
        this.mapper = mapper;
        this.userRepository = userRepository;
    }

    @Override
    public Message mapToEntity(MessageDto messageDto) {
        User sender = userRepository.findByUsername(messageDto.getSenderUsername());
        if (sender == null) {
            throw new UserNotFoundException("Sender not found");
        }
        User receiver = userRepository.findByUsername(messageDto.getReceiverUsername());
        if (receiver == null) {
            throw new UserNotFoundException("Sender not found");
        }

        Message message = mapper.map(messageDto, Message.class);

        message.setSender(sender);
        message.setReceiver(receiver);

        return message;
    }

    @Override
    public MessageDto mapToDto(Message message) {
        return mapper.map(message, MessageDto.class);
    }
}
