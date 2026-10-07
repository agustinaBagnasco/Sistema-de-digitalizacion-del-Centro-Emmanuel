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
        private String destinoLeche;

        public MovimientoStockResponse() {
        }

        public MovimientoStockResponse(Integer id, BigDecimal cantidad, String tipo,
                                                                   LocalDateTime fecha, String motivo,
                                                                   String usuario, String destinoLeche) {
                this.id = id;
                this.cantidad = cantidad;
                this.tipo = tipo;
                this.fecha = fecha;
                this.motivo = motivo;
                this.usuario = usuario;
                this.destinoLeche = destinoLeche;
        }

    //region Getters y Setters
    public Integer getId(){return id;}
    public void setId(Integer pId){this.id = pId;}

    public BigDecimal getCantidad(){return cantidad;}
    public void setCantidad(BigDecimal pCantidad){this.cantidad = pCantidad;}

    public String getTipo(){return tipo;}
    public void setTipo(String pTipo){this.tipo = pTipo;}

    public LocalDateTime getFecha(){return fecha;}
    public void setFecha(LocalDateTime pFecha){this.fecha = pFecha;}

    public String getMotivo(){return motivo;}
    public void setMotivo(String pMotivo){this.motivo = pMotivo;}

    public String getUsuario(){return usuario;}
    public void setUsuario(String pUsuario){this.usuario = pUsuario;}

    public String getDestinoLeche(){return destinoLeche;}
    public void setDestinoLeche(String pDestinoLeche){this.destinoLeche = pDestinoLeche;}
    //endregion
}
