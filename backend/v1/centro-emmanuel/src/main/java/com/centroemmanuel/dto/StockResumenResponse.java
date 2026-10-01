package com.centroemmanuel.dto;

import java.math.BigDecimal;

public class StockResumenResponse {
        private Integer idProducto;
        private BigDecimal entradas;
        private BigDecimal salidas;

        public StockResumenResponse() {
        }

        public StockResumenResponse(Integer idProducto, BigDecimal entradas, BigDecimal salidas) {
                this.idProducto = idProducto;
                this.entradas = entradas;
                this.salidas = salidas;
        }

        public Integer getIdProducto() { return idProducto; }
        public void setIdProducto(Integer idProducto) { this.idProducto = idProducto; }

        public BigDecimal getEntradas() { return entradas; }
        public void setEntradas(BigDecimal entradas) { this.entradas = entradas; }

        public BigDecimal getSalidas() { return salidas; }
        public void setSalidas(BigDecimal salidas) { this.salidas = salidas; }
}
