package com.ckarena.backend.domain.chat.service;

import com.ckarena.backend.domain.chat.dto.ChatMessageResponse;
import com.ckarena.backend.domain.chat.dto.PageResponse;
import com.ckarena.backend.domain.chat.dto.SendMessageRequest;
import com.ckarena.backend.domain.chat.entity.ChatMessage;
import com.ckarena.backend.domain.chat.entity.ChatRoom;
import com.ckarena.backend.domain.chat.repository.ChatMessageRepository;
import com.ckarena.backend.domain.chat.repository.ChatRoomRepository;
import com.ckarena.backend.domain.user.entity.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;

    public ChatMessageService(ChatMessageRepository chatMessageRepository, ChatRoomRepository chatRoomRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ChatMessageResponse> findMessages(Long roomId, int page, int size) {
        findRoomOrThrow(roomId);
        return PageResponse.from(
                chatMessageRepository.findByRoomIdOrderByCreatedAtDesc(roomId, PageRequest.of(page, size))
                        .map(ChatMessageResponse::from)
        );
    }

    @Transactional
    public ChatMessageResponse send(Long roomId, User sender, SendMessageRequest request) {
        ChatRoom room = findRoomOrThrow(roomId);
        ChatMessage message = chatMessageRepository.save(new ChatMessage(room, sender, request.content()));
        return ChatMessageResponse.from(message);
    }

    private ChatRoom findRoomOrThrow(Long roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방을 찾을 수 없습니다."));
    }
}
