package com.centroemmanuel.controller;

import com.centroemmanuel.dto.ReporteRequest;
import com.centroemmanuel.dto.ReporteResponse;
import com.centroemmanuel.service.ReporteService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:5173")
public class ReporteController {
    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @PostMapping
    public ResponseEntity<?> generar(@RequestBody ReporteRequest request) {
        try {
            ReporteResponse reporte = reporteService.generar(request);
            return ResponseEntity.ok(reporte);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.getMessage()));
        }
    }

    @GetMapping("/mensuales")
    public ResponseEntity<?> listarReportesMensuales() {
        return ResponseEntity.ok(reporteService.listarMensuales());
    }

    @PostMapping("/mensuales/{periodo}/prueba")
    public ResponseEntity<?> generarReporteMensualPrueba(@PathVariable String periodo) {
        try {
            return ResponseEntity.ok(reporteService.generarMensualPrueba(periodo));
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", error.getMessage()));
        }
    }

    @GetMapping("/mensuales/prueba-todos-los-datos")
    public ResponseEntity<byte[]> descargarReporteMensualPruebaCompleto() {
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"reporte-mensual-prueba-todos-los-datos.xlsx\"")
                .body(reporteService.generarMensualPruebaTodosLosDatos());
    }

    @GetMapping("/mensuales/{periodo}/descarga")
    public ResponseEntity<?> descargarReporteMensual(@PathVariable String periodo) {
        try {
            byte[] archivo = reporteService.obtenerMensual(periodo);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"reporte-general-" + periodo + ".xlsx\"")
                    .body(archivo);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.notFound().build();
        }
    }
}
