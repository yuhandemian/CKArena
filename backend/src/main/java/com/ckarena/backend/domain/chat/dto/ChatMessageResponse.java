package com.ckarena.backend.domain.chat.dto;

import com.ckarena.backend.domain.chat.entity.ChatMessage;
import java.time.LocalDateTime;

public record ChatMessageResponse(
        Long id,
        String nickname,
        String content,
        LocalDateTime createdAt
) {
    public static ChatMessageResponse from(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getSender().getNickname(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}
