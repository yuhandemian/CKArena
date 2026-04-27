package com.ckarena.backend.domain.chat.service;

import com.ckarena.backend.domain.chat.dto.ChatRoomResponse;
import com.ckarena.backend.domain.chat.dto.CreateChatRoomRequest;
import com.ckarena.backend.domain.chat.entity.ChatRoom;
import com.ckarena.backend.domain.chat.repository.ChatRoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoomService(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }

    @Transactional(readOnly = true)
    public List<ChatRoomResponse> findAll() {
        return chatRoomRepository.findAll().stream()
                .map(ChatRoomResponse::from)
                .toList();
    }

    @Transactional
    public ChatRoomResponse create(CreateChatRoomRequest request) {
        ChatRoom room = chatRoomRepository.save(new ChatRoom(request.name()));
        return ChatRoomResponse.from(room);
    }
}
