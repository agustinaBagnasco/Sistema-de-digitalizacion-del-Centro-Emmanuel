package com.centroemmanuel.controller;

import com.centroemmanuel.dto.VentaRequest;
import com.centroemmanuel.service.VentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:5173")
public class VentaController {
    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @PostMapping("/importar")
    public ResponseEntity<Map<String, Object>> importar(@RequestBody VentaRequest request) {
        try {
            int cantidad = ventaService.importar(request);
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Ventas importadas correctamente.",
                    "cantidad", cantidad
            ));
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.getMessage()));
        }
    }
}
