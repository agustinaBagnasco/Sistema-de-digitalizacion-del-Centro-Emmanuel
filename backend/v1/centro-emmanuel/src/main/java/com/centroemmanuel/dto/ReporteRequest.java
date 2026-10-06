package com.centroemmanuel.dto;

import java.time.LocalDate;

public class ReporteRequest {
    private String tipo;
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;

    //region Getters y Setters
    public String getTipo(){return tipo;}
    public void setTipo(String pTipo){this.tipo = pTipo;}

    public LocalDate getFechaDesde(){return fechaDesde;}
    public void setFechaDesde(LocalDate pFechaDesde){this.fechaDesde = pFechaDesde;}

    public LocalDate getFechaHasta(){return fechaHasta;}
    public void setFechaHasta(LocalDate pFechaHasta){this.fechaHasta = pFechaHasta;}
    //endregion
}
