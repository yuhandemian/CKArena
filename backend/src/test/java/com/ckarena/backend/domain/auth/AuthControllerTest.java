package com.ckarena.backend.domain.auth;

import com.ckarena.backend.common.interceptor.AuthInterceptor;
import com.ckarena.backend.domain.auth.controller.AuthController;
import com.ckarena.backend.domain.auth.dto.GuestAuthResponse;
import com.ckarena.backend.domain.auth.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    AuthService authService;

    // AuthInterceptor 는 이 테스트 범위 밖이므로 Mock 등록
    @MockBean
    AuthInterceptor authInterceptor;

    @Test
    void createGuest_성공() throws Exception {
        given(authService.createGuestSession("Faker팬123"))
                .willReturn(new GuestAuthResponse("test-token-uuid", "Faker팬123"));

        mockMvc.perform(post("/api/auth/guest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("nickname", "Faker팬123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sessionToken").value("test-token-uuid"))
                .andExpect(jsonPath("$.nickname").value("Faker팬123"));
    }

    @Test
    void createGuest_닉네임_빈값_400() throws Exception {
        mockMvc.perform(post("/api/auth/guest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("nickname", ""))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createGuest_닉네임_1자_400() throws Exception {
        mockMvc.perform(post("/api/auth/guest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("nickname", "A"))))
                .andExpect(status().isBadRequest());
    }
}
