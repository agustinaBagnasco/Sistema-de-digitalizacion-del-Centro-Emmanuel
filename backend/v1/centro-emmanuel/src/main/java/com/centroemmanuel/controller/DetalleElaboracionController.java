package com.centroemmanuel.controller;

import com.centroemmanuel.entity.DetalleElaboracion;
import com.centroemmanuel.service.DetalleElaboracionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle-elaboraciones")
@CrossOrigin(origins = "http://localhost:5173")
public class DetalleElaboracionController {

    private final DetalleElaboracionService detalleElaboracionService;

    public DetalleElaboracionController(
            DetalleElaboracionService detalleElaboracionService) {

        this.detalleElaboracionService =
                detalleElaboracionService;
    }

    @GetMapping
    public ResponseEntity<List<DetalleElaboracion>> obtenerTodos() {

        return ResponseEntity.ok(
                detalleElaboracionService.obtenerTodos()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleElaboracion> obtenerPorId(
            @PathVariable Integer id) {

        return detalleElaboracionService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DetalleElaboracion> crear(
            @RequestBody DetalleElaboracion detalle) {

        DetalleElaboracion nuevo =
                detalleElaboracionService.guardar(detalle);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetalleElaboracion> actualizar(
            @PathVariable Integer id,
            @RequestBody DetalleElaboracion detalle) {

        DetalleElaboracion actualizado =
                detalleElaboracionService.actualizar(
                        id,
                        detalle
                );

        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        if (!detalleElaboracionService.eliminar(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}