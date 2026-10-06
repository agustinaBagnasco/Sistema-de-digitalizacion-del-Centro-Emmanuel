package com.centroemmanuel.dto;

import java.math.BigDecimal;

public class MovimientoStockRequest {
    private Integer idProducto;
    private Integer idUsuario;
    private BigDecimal cantidad;
    private String tipo;
    private String motivo;
    private String destinoLeche;

    public MovimientoStockRequest() {
    }

    public MovimientoStockRequest(Integer idProducto, Integer idUsuario,
                                  BigDecimal cantidad, String tipo, String motivo) {
        this.idProducto = idProducto;
        this.idUsuario = idUsuario;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.motivo = motivo;
    }

    //region Getters y Setters
    public Integer getIdProducto(){return idProducto;}
    public void setIdProducto(Integer pIdProducto){this.idProducto = pIdProducto;}

    public Integer getIdUsuario(){return idUsuario;}
    public void setIdUsuario(Integer pIdUsuario){this.idUsuario = pIdUsuario;}

    public BigDecimal getCantidad(){return cantidad;}
    public void setCantidad(BigDecimal pCantidad){this.cantidad = pCantidad;}

    public String getTipo(){return tipo;}
    public void setTipo(String pTipo){this.tipo = pTipo;}

    public String getMotivo(){return motivo;}
    public void setMotivo(String pMotivo){this.motivo = pMotivo;}

    public String getDestinoLeche(){return destinoLeche;}
    public void setDestinoLeche(String pDestinoLeche){this.destinoLeche = pDestinoLeche;}
    //endregion
}
