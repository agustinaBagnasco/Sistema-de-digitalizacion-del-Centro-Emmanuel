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

    //region Getters y Setters
    public Integer getIdProducto(){return idProducto;}
    public void setIdProducto(Integer pIdProducto){this.idProducto = pIdProducto;}

    public BigDecimal getEntradas(){return entradas;}
    public void setEntradas(BigDecimal pEntradas){this.entradas = pEntradas;}

    public BigDecimal getSalidas(){return salidas;}
    public void setSalidas(BigDecimal pSalidas){this.salidas = pSalidas;}
    //endregion
}
