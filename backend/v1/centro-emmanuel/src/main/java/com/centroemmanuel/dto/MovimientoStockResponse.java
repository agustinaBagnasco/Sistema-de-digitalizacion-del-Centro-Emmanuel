package com.centroemmanuel.dto;

import java.time.LocalDateTime;
import java.math.BigDecimal;

public class MovimientoStockResponse {
        private Integer id;
        private BigDecimal cantidad;
        private String tipo;
        private LocalDateTime fecha;
        private String motivo;
        private String usuario;

        public MovimientoStockResponse() {
        }

        public MovimientoStockResponse(Integer id, BigDecimal cantidad, String tipo,
                                                                   LocalDateTime fecha, String motivo,
                                                                   String usuario) {
                this.id = id;
                this.cantidad = cantidad;
                this.tipo = tipo;
                this.fecha = fecha;
                this.motivo = motivo;
                this.usuario = usuario;
        }

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public BigDecimal getCantidad() { return cantidad; }
        public void setCantidad(BigDecimal cantidad) { this.cantidad = cantidad; }

        public String getTipo() { return tipo; }
        public void setTipo(String tipo) { this.tipo = tipo; }

        public LocalDateTime getFecha() { return fecha; }
        public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }

        public String getUsuario() { return usuario; }
        public void setUsuario(String usuario) { this.usuario = usuario; }
}
