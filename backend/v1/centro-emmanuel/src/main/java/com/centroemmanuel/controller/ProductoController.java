package com.centroemmanuel.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.service.ProductoService;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<Producto>> listar() {

        return ResponseEntity.ok(
                productoService.listar()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(
            @PathVariable("id") Integer id) {

        Optional<Producto> producto =
                productoService.buscarPorId(id);

        if (producto.isPresent()) {
            return ResponseEntity.ok(producto.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> guardar(
            @RequestBody Producto producto,
            @RequestParam(name = "idUsuario", required = false) Integer idUsuario) {
        try {
            Producto nuevoProducto = productoService.guardar(producto, idUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.getMessage()));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(
            @PathVariable("id") Integer id,
            @RequestBody Producto producto) {

        Producto actualizado =
                productoService.actualizar(id, producto);

        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(actualizado);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable("id") Integer id) {

        Optional<Producto> producto =
                productoService.buscarPorId(id);

        if (producto.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            productoService.eliminar(id);
        } catch (IllegalStateException error) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("mensaje", error.getMessage()));
        }

        return ResponseEntity.noContent().build();
    }
}