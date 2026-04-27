package com.ckarena.backend.domain.chat.controller;

import com.ckarena.backend.domain.chat.dto.ChatMessageResponse;
import com.ckarena.backend.domain.chat.dto.PageResponse;
import com.ckarena.backend.domain.chat.dto.SendMessageRequest;
import com.ckarena.backend.domain.chat.service.ChatMessageService;
import com.ckarena.backend.domain.user.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/chat/rooms/{roomId}/messages")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    public ChatMessageController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<ChatMessageResponse>> list(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(chatMessageService.findMessages(roomId, page, size));
    }

    @PostMapping
    public ResponseEntity<ChatMessageResponse> send(
            @PathVariable Long roomId,
            @RequestAttribute(name = "currentUser", required = false) User currentUser,
            @Valid @RequestBody SendMessageRequest request
    ) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증 토큰이 필요합니다.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(chatMessageService.send(roomId, currentUser, request));
    }
}
