package com.centroemmanuel.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.entity.Cosecha;
import com.centroemmanuel.service.CosechaService;

@RestController
@RequestMapping("/api/cosechas")
@CrossOrigin(origins = "http://localhost:5173")
public class CosechaController {

    private final CosechaService cosechaService;

    public CosechaController(CosechaService cosechaService) {
        this.cosechaService = cosechaService;
    }


    // ==========================================
    // LISTAR TODAS
    // GET /cosechas
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Cosecha>> listar() {

        return ResponseEntity.ok(
                cosechaService.listar()
        );
    }


    // ==========================================
    // BUSCAR POR ID
    // GET /cosechas/1
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Cosecha> buscarPorId(
            @PathVariable Integer id) {

        Optional<Cosecha> cosecha =
                cosechaService.buscarPorId(id);

        if (cosecha.isPresent()) {
            return ResponseEntity.ok(cosecha.get());
        }

        return ResponseEntity.notFound().build();
    }


    // ==========================================
    // CREAR
    // POST /cosechas
    // ==========================================

    @PostMapping
    public ResponseEntity<Cosecha> guardar(
            @RequestBody Cosecha cosecha) {

        Cosecha nuevaCosecha =
                cosechaService.guardar(cosecha);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevaCosecha);
    }


    // ==========================================
    // ACTUALIZAR
    // PUT /cosechas/1
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<Cosecha> actualizar(
            @PathVariable Integer id,
            @RequestBody Cosecha cosecha) {

        Cosecha actualizada =
                cosechaService.actualizar(id, cosecha);

        if (actualizada == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(actualizada);
    }


    // ==========================================
    // ELIMINAR
    // DELETE /cosechas/1
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        Optional<Cosecha> cosecha =
                cosechaService.buscarPorId(id);

        if (cosecha.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        cosechaService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}
