package com.centroemmanuel.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_venta")
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_venta")
    private Integer idDetalleVenta;

    @ManyToOne
    @JoinColumn(name = "id_venta")
    private Venta venta;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto productoVendido;

    @Column(name = "cantidad")
    private double cantidadDV;

    @Column(name = "precio_unitario", precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;

    public DetalleVenta(){}

    public DetalleVenta(Integer idDetalleVenta,
                        Producto productoVendido,
                        double cantidadDV,
                        BigDecimal precioUnitario){
        this.idDetalleVenta = idDetalleVenta;
        this.productoVendido = productoVendido;
        this.cantidadDV = cantidadDV;
        this.precioUnitario = precioUnitario;
    }

    public Venta getVenta(){return venta;}
    public void setVenta(Venta venta){this.venta = venta;}

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
