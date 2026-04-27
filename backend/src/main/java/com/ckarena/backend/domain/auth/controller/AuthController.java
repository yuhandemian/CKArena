package com.ckarena.backend.domain.auth.controller;

import com.ckarena.backend.domain.auth.dto.GuestAuthRequest;
import com.ckarena.backend.domain.auth.dto.GuestAuthResponse;
import com.ckarena.backend.domain.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/guest")
    public ResponseEntity<GuestAuthResponse> createGuest(@Valid @RequestBody GuestAuthRequest request) {
        return ResponseEntity.ok(authService.createGuestSession(request.nickname()));
    }
}
