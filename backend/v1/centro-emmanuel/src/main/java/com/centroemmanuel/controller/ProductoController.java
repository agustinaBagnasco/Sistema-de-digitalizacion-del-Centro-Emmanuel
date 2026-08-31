package com.centroemmanuel.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.service.ProductoService;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }


    // ==========================================
    // LISTAR PRODUCTOS
    // GET /productos
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Producto>> listar() {

        return ResponseEntity.ok(
                productoService.listar()
        );
    }


    // ==========================================
    // BUSCAR PRODUCTO
    // GET /productos/{id}
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(
            @PathVariable Integer id) {

        Optional<Producto> producto =
                productoService.buscarPorId(id);

        if (producto.isPresent()) {
            return ResponseEntity.ok(producto.get());
        }

        return ResponseEntity.notFound().build();
    }


    // ==========================================
    // CREAR PRODUCTO
    // POST /productos
    // ==========================================

    @PostMapping
    public ResponseEntity<Producto> guardar(
            @RequestBody Producto producto) {

        Producto nuevoProducto =
                productoService.guardar(producto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevoProducto);
    }


    // ==========================================
    // ACTUALIZAR PRODUCTO
    // PUT /productos/{id}
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(
            @PathVariable Integer id,
            @RequestBody Producto producto) {

        Producto actualizado =
                productoService.actualizar(id, producto);

        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(actualizado);
    }


    // ==========================================
    // ELIMINAR PRODUCTO
    // DELETE /productos/{id}
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        Optional<Producto> producto =
                productoService.buscarPorId(id);

        if (producto.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        productoService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}