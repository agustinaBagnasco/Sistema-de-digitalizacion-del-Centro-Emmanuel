package com.centroemmanuel.controller;

import com.centroemmanuel.entity.Elaboracion;
import com.centroemmanuel.service.ElaboracionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/elaboraciones")
@CrossOrigin(origins = "http://localhost:5173")
public class ElaboracionController {

    private final ElaboracionService elaboracionService;

    public ElaboracionController(ElaboracionService elaboracionService) {
        this.elaboracionService = elaboracionService;
    }

    @GetMapping
    public ResponseEntity<List<Elaboracion>> obtenerTodas() {

        return ResponseEntity.ok(
                elaboracionService.obtenerTodas()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Elaboracion> obtenerPorId(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                elaboracionService.obtenerPorId(id)
        );
    }

    @PostMapping
    public ResponseEntity<?> crear(
            @RequestBody Elaboracion elaboracion) {
        try {
            return ResponseEntity.ok(elaboracionService.guardar(elaboracion));
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Integer id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Integer idActor,
            @RequestBody Elaboracion elaboracion) {
        try {
            return ResponseEntity.ok(elaboracionService.actualizar(id, elaboracion, idActor));
        } catch (SecurityException error) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("mensaje", error.getMessage()));
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Integer id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Integer idActor) {
        try {
            elaboracionService.eliminar(id, idActor);
            return ResponseEntity.noContent().build();
        } catch (SecurityException error) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("mensaje", error.getMessage()));
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.getMessage()));
        }
    }
}