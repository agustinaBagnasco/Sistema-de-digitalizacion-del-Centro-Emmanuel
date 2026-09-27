package com.centroemmanuel.dto;

public class StockResumenResponse {
        private Integer idProducto;
        private double entradas;
        private double salidas;

        public StockResumenResponse() {
        }

        public StockResumenResponse(Integer idProducto, double entradas, double salidas) {
                this.idProducto = idProducto;
                this.entradas = entradas;
                this.salidas = salidas;
        }

        public Integer getIdProducto() { return idProducto; }
        public void setIdProducto(Integer idProducto) { this.idProducto = idProducto; }

        public double getEntradas() { return entradas; }
        public void setEntradas(double entradas) { this.entradas = entradas; }

        public double getSalidas() { return salidas; }
        public void setSalidas(double salidas) { this.salidas = salidas; }
}
