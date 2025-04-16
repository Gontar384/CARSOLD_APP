package org.gontar.carsold.Domain.Model.Message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDto {
    private String username;
    private String profilePic;
    private String lastMessage;
    private LocalDateTime timestamp;
    private boolean seen;
    private String sentBy;
}