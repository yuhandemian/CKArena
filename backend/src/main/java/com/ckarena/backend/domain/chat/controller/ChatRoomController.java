package com.ckarena.backend.domain.chat.controller;

import com.ckarena.backend.domain.chat.dto.ChatRoomResponse;
import com.ckarena.backend.domain.chat.dto.CreateChatRoomRequest;
import com.ckarena.backend.domain.chat.service.ChatRoomService;
import com.ckarena.backend.domain.user.entity.User;
import com.ckarena.backend.domain.user.entity.UserRole;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/chat/rooms")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    public ChatRoomController(ChatRoomService chatRoomService) {
        this.chatRoomService = chatRoomService;
    }

    @GetMapping
    public ResponseEntity<List<ChatRoomResponse>> list() {
        return ResponseEntity.ok(chatRoomService.findAll());
    }

    @PostMapping
    public ResponseEntity<ChatRoomResponse> create(
            @RequestAttribute(name = "currentUser", required = false) User currentUser,
            @Valid @RequestBody CreateChatRoomRequest request
    ) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증 토큰이 필요합니다.");
        }
        if (currentUser.getRole() != UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자만 채팅방을 생성할 수 있습니다.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(chatRoomService.create(request));
    }
}
