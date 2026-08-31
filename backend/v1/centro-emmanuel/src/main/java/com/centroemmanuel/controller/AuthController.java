package com.centroemmanuel.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.dto.LoginRequest;
import com.centroemmanuel.dto.LoginResponse;
import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        Optional<Usuario> usuario =
                usuarioRepository.findByNombreUsuario(
                        request.getNombreUsuario()
                );

        if (usuario.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                        new LoginResponse(
                            false,
                            "Usuario o contraseña incorrectos.",
                            null,
                            null
                        )
                    );
        }

        if (!usuario.get().getClave()
                .equals(request.getClave())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                        new LoginResponse(
                            false,
                            "Usuario o contraseña incorrectos.",
                            null,
                            null
                        )
                    );
        }

        return ResponseEntity.ok(
                new LoginResponse(
                        true,
                        "Inicio de sesión correcto.",
                        usuario.get().getIdUsuario(),
                        usuario.get().getNombre()
                )
        );
    }
}