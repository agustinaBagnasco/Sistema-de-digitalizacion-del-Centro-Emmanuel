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

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public List<VentaImportada> getVentas() {
        return ventas;
    }

    public void setVentas(List<VentaImportada> ventas) {
        this.ventas = ventas;
    }

    public static class VentaImportada {
        private LocalDate fecha;
        private String concepto;
        private BigDecimal cantidad;
        private BigDecimal unitario;
        private BigDecimal total;

        public LocalDate getFecha() {
            return fecha;
        }

        public void setFecha(LocalDate fecha) {
            this.fecha = fecha;
        }

        public String getConcepto() {
            return concepto;
        }

        public void setConcepto(String concepto) {
            this.concepto = concepto;
        }

        public BigDecimal getCantidad() {
            return cantidad;
        }

        public void setCantidad(BigDecimal cantidad) {
            this.cantidad = cantidad;
        }

        public BigDecimal getUnitario() {
            return unitario;
        }

        public void setUnitario(BigDecimal unitario) {
            this.unitario = unitario;
        }

        public BigDecimal getTotal() {
            return total;
        }

        public void setTotal(BigDecimal total) {
            this.total = total;
        }
    }
}
