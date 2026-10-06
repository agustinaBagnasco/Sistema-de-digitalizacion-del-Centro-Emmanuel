package com.centroemmanuel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class VentaRequest {
    private Integer idUsuario;
    private List<VentaImportada> ventas;

    public VentaRequest() {
    }

    public VentaRequest(Integer idUsuario, List<VentaImportada> ventas) {
        this.idUsuario = idUsuario;
        this.ventas = ventas;
    }

    //region Getters y Setters
    public Integer getIdUsuario(){return idUsuario;}
    public void setIdUsuario(Integer pIdUsuario){this.idUsuario = pIdUsuario;}

    public List<VentaImportada> getVentas(){return ventas;}
    public void setVentas(List<VentaImportada> pVentas){this.ventas = pVentas;}
    //endregion

    public static class VentaImportada {
        private LocalDate fecha;
        private String concepto;
        private BigDecimal cantidad;
        private BigDecimal unitario;
        private BigDecimal total;

        //region Getters y Setters
        public LocalDate getFecha(){return fecha;}
        public void setFecha(LocalDate pFecha){this.fecha = pFecha;}

        public String getConcepto(){return concepto;}
        public void setConcepto(String pConcepto){this.concepto = pConcepto;}

        public BigDecimal getCantidad(){return cantidad;}
        public void setCantidad(BigDecimal pCantidad){this.cantidad = pCantidad;}

        public BigDecimal getUnitario(){return unitario;}
        public void setUnitario(BigDecimal pUnitario){this.unitario = pUnitario;}

        public BigDecimal getTotal(){return total;}
        public void setTotal(BigDecimal pTotal){this.total = pTotal;}
        //endregion
    }
}