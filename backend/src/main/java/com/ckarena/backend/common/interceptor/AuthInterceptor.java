package com.ckarena.backend.common.interceptor;

import com.ckarena.backend.domain.user.entity.GuestSession;
import com.ckarena.backend.domain.user.repository.GuestSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final GuestSessionRepository guestSessionRepository;

    public AuthInterceptor(GuestSessionRepository guestSessionRepository) {
        this.guestSessionRepository = guestSessionRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "인증 토큰이 필요합니다.");
            return false;
        }

        String token = header.substring(7);
        GuestSession session = guestSessionRepository.findBySessionToken(token).orElse(null);
        if (session == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 토큰입니다.");
            return false;
        }

        request.setAttribute("currentUser", session.getUser());
        return true;
    }
}
