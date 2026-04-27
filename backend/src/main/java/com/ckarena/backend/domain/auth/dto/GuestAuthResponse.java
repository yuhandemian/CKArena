package com.ckarena.backend.domain.auth.dto;

public record GuestAuthResponse(
        String sessionToken,
        String nickname
) {}
