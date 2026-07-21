package com.centroemmanuel.entity;

import java.math.BigDecimal;

public class DetalleVenta {
    private int idDetalleVenta;
    private Producto productoVendido;
    private double cantidadDV;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;

    public DetalleVenta(){}

    public DetalleVenta(int pIdDetalleElaboracion, Producto pProductoVendido, double pCantidadProducida, BigDecimal pPrecioUnitario){
        this.idDetalleVenta = pIdDetalleElaboracion;
        this.productoVendido = pProductoVendido;
        this.cantidadDV = pCantidadProducida;
        this.precioUnitario = pPrecioUnitario;
    }

    //region Getters y Setters
    public int getIdDetalleVenta(){return idDetalleVenta;}
    public void setIdDetalleVenta(int pIdDetalleVenta){this.idDetalleVenta = pIdDetalleVenta;}

    public Producto getProductoVendido(){return productoVendido;}
    public void setProductoVendido(Producto pProductoVendido){this.productoVendido = pProductoVendido;}

    public double getCantidadDV(){return cantidadDV;}
    public void setCantidadDV(double pCantidadDV){this.cantidadDV = pCantidadDV;}

    public BigDecimal getPrecioUnitario(){return precioUnitario;}
    public void setPrecioUnitario(BigDecimal pPrecioUnitario){this.precioUnitario = pPrecioUnitario;}

    public BigDecimal getSubtotal(){return subtotal;}
    public void setSubtotal(BigDecimal pSubtotal){this.subtotal = pSubtotal;}
    //endregion
}
