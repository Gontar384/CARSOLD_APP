package org.gontar.carsold.Config.MapperConfig.UserMapper;

import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Model.UserDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapperImpl implements Mapper<User, UserDto> {

    private final ModelMapper mapper;

    public UserMapperImpl(ModelMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public User mapToEntity(UserDto userDto) {
        return mapper.map(userDto, User.class);
    }
}
