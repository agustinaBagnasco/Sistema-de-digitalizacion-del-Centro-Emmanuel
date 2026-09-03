package com.centroemmanuel.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // GET /api/usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {

        return ResponseEntity.ok(
                usuarioService.listarTodos()
        );
    }

    // GET /api/usuarios/1
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscar(@PathVariable int id) {

        Optional<Usuario> usuario =
                usuarioService.buscarPorId(id);

        if (usuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(usuario.get());
    }

    // POST /api/usuarios
    @PostMapping
    public ResponseEntity<Usuario> crear(
            @RequestBody Usuario usuario) {

        Usuario nuevoUsuario =
                usuarioService.crear(usuario);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevoUsuario);
    }

    // PUT /api/usuarios/1
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> modificar(
            @PathVariable int id,
            @RequestBody Usuario usuario) {

        Usuario usuarioModificado =
                usuarioService.modificar(id, usuario);

        if (usuarioModificado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(usuarioModificado);
    }

    // DELETE /api/usuarios/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable int id) {

        boolean eliminado =
                usuarioService.eliminar(id);

        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}