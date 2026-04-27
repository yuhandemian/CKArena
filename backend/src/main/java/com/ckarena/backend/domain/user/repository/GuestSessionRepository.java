package com.ckarena.backend.domain.user.repository;

import com.ckarena.backend.domain.user.entity.GuestSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GuestSessionRepository extends JpaRepository<GuestSession, Long> {
    Optional<GuestSession> findBySessionToken(String sessionToken);
}
