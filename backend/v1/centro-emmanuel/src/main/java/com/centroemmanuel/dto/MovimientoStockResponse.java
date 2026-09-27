package com.centroemmanuel.dto;

import java.time.LocalDate;

public class MovimientoStockResponse {
        private Integer id;
        private double cantidad;
        private String tipo;
        private LocalDate fecha;
        private String motivo;

        public MovimientoStockResponse() {
        }

        public MovimientoStockResponse(Integer id, double cantidad, String tipo,
                                                                   LocalDate fecha, String motivo) {
                this.id = id;
                this.cantidad = cantidad;
                this.tipo = tipo;
                this.fecha = fecha;
                this.motivo = motivo;
        }

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public double getCantidad() { return cantidad; }
        public void setCantidad(double cantidad) { this.cantidad = cantidad; }

        public String getTipo() { return tipo; }
        public void setTipo(String tipo) { this.tipo = tipo; }

        public LocalDate getFecha() { return fecha; }
        public void setFecha(LocalDate fecha) { this.fecha = fecha; }

        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
}
