package com.ckarena.backend.domain.chat;

import com.ckarena.backend.common.interceptor.AuthInterceptor;
import com.ckarena.backend.domain.chat.controller.ChatMessageController;
import com.ckarena.backend.domain.chat.dto.ChatMessageResponse;
import com.ckarena.backend.domain.chat.dto.PageResponse;
import com.ckarena.backend.domain.chat.service.ChatMessageService;
import com.ckarena.backend.domain.user.entity.User;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ChatMessageController.class)
class ChatMessageControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    ChatMessageService chatMessageService;

    @MockBean
    AuthInterceptor authInterceptor;

    @BeforeEach
    void allowInterceptor() throws Exception {
        given(authInterceptor.preHandle(any(), any(), any())).willReturn(true);
    }

    private static RequestPostProcessor asGuest() {
        return request -> {
            try {
                var constructor = User.class.getDeclaredConstructor(String.class);
                constructor.setAccessible(true);
                request.setAttribute("currentUser", constructor.newInstance("테스트유저"));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            return request;
        };
    }

    @Test
    void 메시지_목록_조회_인증없이_성공() throws Exception {
        PageResponse<ChatMessageResponse> page = new PageResponse<>(
                List.of(new ChatMessageResponse(1L, "Faker팬", "안녕하세요", LocalDateTime.now())),
                0, 20, 1L, 1, true
        );
        given(chatMessageService.findMessages(eq(1L), eq(0), eq(20))).willReturn(page);

        mockMvc.perform(get("/api/chat/rooms/1/messages"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].nickname").value("Faker팬"))
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.last").value(true));
    }

    @Test
    void 메시지_전송_인증_성공() throws Exception {
        given(chatMessageService.send(eq(1L), any(), any()))
                .willReturn(new ChatMessageResponse(1L, "테스트유저", "안녕!", LocalDateTime.now()));

        mockMvc.perform(post("/api/chat/rooms/1/messages")
                        .with(asGuest())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("content", "안녕!"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value("안녕!"));
    }

    @Test
    void 메시지_전송_인증없음_401() throws Exception {
        mockMvc.perform(post("/api/chat/rooms/1/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("content", "안녕!"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void 메시지_전송_내용_빈값_400() throws Exception {
        mockMvc.perform(post("/api/chat/rooms/1/messages")
                        .with(asGuest())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("content", ""))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void 메시지_목록_page_size_파라미터() throws Exception {
        PageResponse<ChatMessageResponse> page = new PageResponse<>(List.of(), 1, 10, 0L, 0, true);
        given(chatMessageService.findMessages(eq(1L), eq(1), eq(10))).willReturn(page);

        mockMvc.perform(get("/api/chat/rooms/1/messages?page=1&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.size").value(10));
    }
}
