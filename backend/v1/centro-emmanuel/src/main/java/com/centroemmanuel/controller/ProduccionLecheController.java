package com.centroemmanuel.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.entity.ProduccionLeche; 
import com.centroemmanuel.service.ProduccionLecheService;

@RestController
@RequestMapping("/api/produccion-leche")
@CrossOrigin(origins = "http://localhost:5173")
public class ProduccionLecheController {
    private final ProduccionLecheService produccionLecheService;

    public ProduccionLecheController(ProduccionLecheService produccionLecheService) {
        this.produccionLecheService = produccionLecheService;
    }

    @GetMapping
    public ResponseEntity<List<ProduccionLeche>> listar() {
        return ResponseEntity.ok(
                produccionLecheService.listar()
        );
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
    public ResponseEntity<ProduccionLeche> guardar(
            @RequestBody ProduccionLeche produccionLeche) {

        ProduccionLeche nuevaProduccionLeche =
                produccionLecheService.guardar(produccionLeche);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevaProduccionLeche);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProduccionLeche> actualizar(
            @PathVariable Integer id,
            @RequestBody ProduccionLeche produccionLeche) {

        Optional<ProduccionLeche> produccionLecheExistente =
                produccionLecheService.buscarPorId(id);

        if (produccionLecheExistente.isPresent()) {
            ProduccionLeche actualizada =
                    produccionLecheService.actualizar(id, produccionLeche);
            return ResponseEntity.ok(actualizada);
        }

        return ResponseEntity.notFound().build();
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        Optional<ProduccionLeche> produccionLecheExistente =
                produccionLecheService.buscarPorId(id);

        if (produccionLecheExistente.isPresent()) {
            produccionLecheService.eliminar(id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}