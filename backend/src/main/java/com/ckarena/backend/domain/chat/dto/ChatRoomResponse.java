package com.ckarena.backend.domain.chat.dto;

import com.ckarena.backend.domain.chat.entity.ChatRoom;
import java.time.LocalDateTime;

public record ChatRoomResponse(
        Long id,
        String name,
        LocalDateTime createdAt
) {
    public static ChatRoomResponse from(ChatRoom room) {
        return new ChatRoomResponse(room.getId(), room.getName(), room.getCreatedAt());
    }
}
