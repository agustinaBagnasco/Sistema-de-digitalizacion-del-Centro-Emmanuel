package com.centroemmanuel.controller;

import com.centroemmanuel.dto.MovimientoStockRequest;
import com.centroemmanuel.dto.StockResumenResponse;
import com.centroemmanuel.dto.MovimientoStockResponse;
import com.centroemmanuel.service.StockService;
import com.centroemmanuel.entity.Producto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "http://localhost:5173")
public class StockController {
    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/resumen-insumos")
    public ResponseEntity<List<StockResumenResponse>> resumenInsumos() {
        return ResponseEntity.ok(stockService.resumenInsumos());
    }

    @GetMapping("/resumen-productos")
    public ResponseEntity<List<StockResumenResponse>> resumenProductos() {
        return ResponseEntity.ok(stockService.resumenProductos());
    }

    @GetMapping("/alertas-stock-minimo")
    public ResponseEntity<List<Producto>> alertasStockMinimo() {
        return ResponseEntity.ok(stockService.alertasStockMinimo());
    }

    @GetMapping("/movimientos/{idProducto}")
    public ResponseEntity<List<MovimientoStockResponse>> movimientos(
            @org.springframework.web.bind.annotation.PathVariable Integer idProducto) {
        return ResponseEntity.ok(stockService.movimientosProducto(idProducto));
    }

    @PostMapping("/movimientos")
    public ResponseEntity<Map<String, String>> registrar(
            @RequestBody MovimientoStockRequest request) {
        try {
            stockService.registrarMovimiento(request);
            return ResponseEntity.ok(Map.of("mensaje", "Movimiento de stock registrado correctamente."));
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.getMessage()));
        }
    }
}
