package com.centroemmanuel.controller;

import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.dto.PermisoRequest;
import com.centroemmanuel.dto.PermisoResponse;
import com.centroemmanuel.service.PermisoService;


@RestController
@RequestMapping("/api/permisos")
@CrossOrigin(origins = "http://localhost:5173")
public class PermisoController {


    private final PermisoService permisoService;


    public PermisoController(PermisoService permisoService) {
        this.permisoService = permisoService;
    }


    @GetMapping
    public ResponseEntity<List<PermisoResponse>> listar() {
        return ResponseEntity.ok(permisoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PermisoResponse> buscar(@PathVariable int id) {
        return permisoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(
            @RequestBody PermisoRequest request,
            @RequestParam int idUsuario) {
        return ejecutarGuardado(() -> permisoService.crear(request, idUsuario), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(
            @PathVariable int id,
            @RequestBody PermisoRequest request,
            @RequestParam int idUsuario) {
        try {
            return permisoService.actualizar(id, request, idUsuario)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("message", error.getMessage()));
        } catch (DataIntegrityViolationException error) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Ya existe un permiso con ese nombre."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        return permisoService.eliminar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    private ResponseEntity<?> ejecutarGuardado(
            Supplier<PermisoResponse> operacion,
            HttpStatus estadoExito) {
        try {
            return ResponseEntity.status(estadoExito).body(operacion.get());
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("message", error.getMessage()));
        } catch (DataIntegrityViolationException error) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Ya existe un permiso con ese nombre."));
        }
    }
}