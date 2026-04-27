package com.ckarena.backend.domain.auth.service;

import com.ckarena.backend.domain.auth.dto.GuestAuthResponse;
import com.ckarena.backend.domain.user.entity.GuestSession;
import com.ckarena.backend.domain.user.entity.User;
import com.ckarena.backend.domain.user.repository.GuestSessionRepository;
import com.ckarena.backend.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final GuestSessionRepository guestSessionRepository;

    public AuthService(UserRepository userRepository, GuestSessionRepository guestSessionRepository) {
        this.userRepository = userRepository;
        this.guestSessionRepository = guestSessionRepository;
    }

    @Transactional
    public GuestAuthResponse createGuestSession(String nickname) {
        User user = userRepository.save(new User(nickname));
        GuestSession session = guestSessionRepository.save(new GuestSession(user));
        return new GuestAuthResponse(session.getSessionToken(), user.getNickname());
    }
}
