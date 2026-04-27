package com.ckarena.backend.domain.user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private UserRole role = UserRole.GUEST;

    protected User() {}

    public User(String nickname) {
        this.nickname = nickname;
        this.role = UserRole.GUEST;
    }

    public Long getId() { return id; }
    public String getNickname() { return nickname; }
    public UserRole getRole() { return role; }
}
