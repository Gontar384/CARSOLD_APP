package org.gontar.carsold.Domain.Model.Message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WholeConversationDto {
    private String username;
    private String profilePic;
    private List<PartialMessageDto> messages;
}
