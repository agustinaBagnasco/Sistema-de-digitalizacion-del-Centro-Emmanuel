package com.centroemmanuel.dto;

import java.math.BigDecimal;

public class MovimientoStockRequest {
    private Integer idProducto;
    private Integer idUsuario;
    private BigDecimal cantidad;
    private String tipo;
    private String motivo;

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

    public Integer getIdProducto() { return idProducto; }
    public void setIdProducto(Integer idProducto) { this.idProducto = idProducto; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public BigDecimal getCantidad() { return cantidad; }
    public void setCantidad(BigDecimal cantidad) { this.cantidad = cantidad; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}
