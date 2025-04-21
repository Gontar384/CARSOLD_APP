package org.gontar.carsold.Domain.Model.Message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationWithUserDto {
    private String username;
    private String profilePic;
    private PagedMessagesDto messages;
    private boolean blockedByUser;
    private boolean blockedUser;
    private boolean seenByUser;
}
