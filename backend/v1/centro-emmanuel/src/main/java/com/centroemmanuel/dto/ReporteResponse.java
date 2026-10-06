package com.centroemmanuel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class ReporteResponse {
    private String tipo;
    private String titulo;
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    private List<String> columnas;
    private List<Map<String, Object>> filas;
    private List<Map<String, Object>> filasDetalle = List.of();
    private Map<String, BigDecimal> totales;

    public ReporteResponse(
            String tipo,
            String titulo,
            LocalDate fechaDesde,
            LocalDate fechaHasta,
            List<String> columnas,
            List<Map<String, Object>> filas,
            Map<String, BigDecimal> totales
    ) {
        this.tipo = tipo;
        this.titulo = titulo;
        this.fechaDesde = fechaDesde;
        this.fechaHasta = fechaHasta;
        this.columnas = columnas;
        this.filas = filas;
        this.totales = totales;
    }

    //region Getters y Setters
    public String getTipo(){return tipo;}

    public String getTitulo(){return titulo;}

    public LocalDate getFechaDesde(){return fechaDesde;}

    public LocalDate getFechaHasta(){return fechaHasta;}

    public List<String> getColumnas(){return columnas;}

    public List<Map<String, Object>> getFilas(){return filas;}

    public List<Map<String, Object>> getFilasDetalle(){return filasDetalle;}
    public void setFilasDetalle(List<Map<String, Object>> pFilasDetalle){this.filasDetalle = pFilasDetalle;}

    public Map<String, BigDecimal> getTotales(){return totales;}
    //endregion
}
