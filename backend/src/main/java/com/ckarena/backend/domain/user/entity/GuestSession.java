package com.ckarena.backend.domain.user.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "guest_sessions")
public class GuestSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 36)
    private String sessionToken;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    protected GuestSession() {}

    public GuestSession(User user) {
        this.user = user;
        this.sessionToken = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getSessionToken() { return sessionToken; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
