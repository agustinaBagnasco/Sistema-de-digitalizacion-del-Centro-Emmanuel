package com.centroemmanuel.dto;

public class MovimientoStockRequest {
    private Integer idProducto;
    private Integer idUsuario;
    private Double cantidad;
    private String tipo;
    private String motivo;

    public MovimientoStockRequest() {
    }

    public MovimientoStockRequest(Integer idProducto, Integer idUsuario,
                                  Double cantidad, String tipo, String motivo) {
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

    public Double getCantidad() { return cantidad; }
    public void setCantidad(Double cantidad) { this.cantidad = cantidad; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}
