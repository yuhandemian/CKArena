package com.ckarena.backend.domain.chat;

import com.ckarena.backend.common.interceptor.AuthInterceptor;
import com.ckarena.backend.domain.chat.controller.ChatRoomController;
import com.ckarena.backend.domain.chat.dto.ChatRoomResponse;
import com.ckarena.backend.domain.chat.service.ChatRoomService;
import com.ckarena.backend.domain.user.entity.User;
import com.ckarena.backend.domain.user.entity.UserRole;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ChatRoomController.class)
class ChatRoomControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    ChatRoomService chatRoomService;

    @MockBean
    AuthInterceptor authInterceptor;

    @BeforeEach
    void allowInterceptor() throws Exception {
        given(authInterceptor.preHandle(any(), any(), any())).willReturn(true);
    }

    private static RequestPostProcessor asUser(UserRole role) {
        return request -> {
            User user = mockUser(role);
            request.setAttribute("currentUser", user);
            return request;
        };
    }

    private static User mockUser(UserRole role) {
        try {
            var constructor = User.class.getDeclaredConstructor(String.class);
            constructor.setAccessible(true);
            User user = constructor.newInstance("테스트유저");
            var roleField = User.class.getDeclaredField("role");
            roleField.setAccessible(true);
            roleField.set(user, role);
            return user;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void 채팅방_목록_조회_인증없이_성공() throws Exception {
        given(chatRoomService.findAll()).willReturn(List.of(
                new ChatRoomResponse(1L, "일반 채팅", LocalDateTime.now())
        ));

        mockMvc.perform(get("/api/chat/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("일반 채팅"));
    }

    @Test
    void 채팅방_생성_관리자_성공() throws Exception {
        given(chatRoomService.create(any())).willReturn(
                new ChatRoomResponse(1L, "새 채팅방", LocalDateTime.now())
        );

        mockMvc.perform(post("/api/chat/rooms")
                        .with(asUser(UserRole.ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "새 채팅방"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("새 채팅방"));
    }

    @Test
    void 채팅방_생성_인증없음_401() throws Exception {
        mockMvc.perform(post("/api/chat/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "새 채팅방"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void 채팅방_생성_GUEST_403() throws Exception {
        mockMvc.perform(post("/api/chat/rooms")
                        .with(asUser(UserRole.GUEST))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "새 채팅방"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void 채팅방_생성_이름_빈값_400() throws Exception {
        mockMvc.perform(post("/api/chat/rooms")
                        .with(asUser(UserRole.ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", ""))))
                .andExpect(status().isBadRequest());
    }
}
