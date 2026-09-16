package com.centroemmanuel.controller;

import com.centroemmanuel.entity.Elaboracion;
import com.centroemmanuel.service.ElaboracionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<Elaboracion> crear(
            @RequestBody Elaboracion elaboracion) {

        return ResponseEntity.ok(
                elaboracionService.guardar(elaboracion)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Elaboracion> actualizar(
            @PathVariable Integer id,
            @RequestBody Elaboracion elaboracion) {

        return ResponseEntity.ok(
                elaboracionService.actualizar(id, elaboracion)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        elaboracionService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}