package org.gontar.carsold.Domain.Model.Message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PagedMessagesDto {
    private List<MessageDto> messages;
    private boolean hasMore;
}

