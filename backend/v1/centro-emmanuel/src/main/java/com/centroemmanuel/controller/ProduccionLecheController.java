package com.centroemmanuel.controller;

import java.util.List;
import java.util.Optional;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.entity.ProduccionLeche; 
import com.centroemmanuel.dto.InventarioLecheResponse;
import com.centroemmanuel.service.InventarioLecheService;
import com.centroemmanuel.service.ProduccionLecheService;

@RestController
@RequestMapping("/api/produccion-leche")
@CrossOrigin(origins = "http://localhost:5173")
public class ProduccionLecheController {
    private final ProduccionLecheService produccionLecheService;
    private final InventarioLecheService inventarioLecheService;

    public ProduccionLecheController(
            ProduccionLecheService produccionLecheService,
            InventarioLecheService inventarioLecheService) {
        this.produccionLecheService = produccionLecheService;
        this.inventarioLecheService = inventarioLecheService;
    }

    @GetMapping
    public ResponseEntity<List<ProduccionLeche>> listar() {
        return ResponseEntity.ok(
                produccionLecheService.listar()
        );
    }

    @GetMapping("/inventario")
    public ResponseEntity<InventarioLecheResponse> inventario() {
        return ResponseEntity.ok(inventarioLecheService.obtenerResumen());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduccionLeche> buscarPorId(
            @PathVariable Integer id) {

        Optional<ProduccionLeche> produccionLeche =
                produccionLecheService.buscarPorId(id);

        if (produccionLeche.isPresent()) {
            return ResponseEntity.ok(produccionLeche.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> guardar(
            @RequestBody ProduccionLeche produccionLeche) {
        try {
            ProduccionLeche nuevaProduccionLeche =
                    produccionLecheService.guardar(produccionLeche);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaProduccionLeche);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Integer id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Integer idActor,
            @RequestBody ProduccionLeche produccionLeche) {

        Optional<ProduccionLeche> produccionLecheExistente =
                produccionLecheService.buscarPorId(id);

        if (produccionLecheExistente.isPresent()) {
            try {
                ProduccionLeche actualizada =
                        produccionLecheService.actualizar(id, produccionLeche, idActor);
                return ResponseEntity.ok(actualizada);
            } catch (IllegalArgumentException error) {
                return ResponseEntity.badRequest().body(Map.of("mensaje", error.getMessage()));
            }
        }

        return ResponseEntity.notFound().build();
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Integer id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Integer idActor) {

        Optional<ProduccionLeche> produccionLecheExistente =
                produccionLecheService.buscarPorId(id);

        if (produccionLecheExistente.isPresent()) {
            try {
                produccionLecheService.eliminar(id, idActor);
                return ResponseEntity.noContent().build();
            } catch (IllegalArgumentException error) {
                return ResponseEntity.badRequest().body(Map.of("mensaje", error.getMessage()));
            }
        }

        return ResponseEntity.notFound().build();
    }
}