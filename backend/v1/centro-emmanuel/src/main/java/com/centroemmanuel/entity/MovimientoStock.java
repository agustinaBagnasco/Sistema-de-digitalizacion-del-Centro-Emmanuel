package com.centroemmanuel.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "movimiento_stock")
public class MovimientoStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mov_stock")
    private Integer idMovStock;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto productoMov;

    @Column(name = "cantidad_mov", nullable = false)
    private double cantidadMov;

    @Column(name = "tipo_mov", length = 20, nullable = false)
    private String tipoMov;

    @Column(name = "fecha_mov", nullable = false)
    private LocalDate fechaMov;

    @Column(name = "motivo_mov", length = 255)
    private String motivoMov;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    public MovimientoStock() {
        this.fechaMov = LocalDate.now();
    }

    public MovimientoStock(Integer idMovStock,
                           Producto productoMov,
                           double cantidadMov,
                           String tipoMov,
                           String motivoMov,
                           Usuario usuario) {

        this.idMovStock = idMovStock;
        this.productoMov = productoMov;
        this.cantidadMov = cantidadMov;
        this.tipoMov = tipoMov; // Corregido
        this.fechaMov = LocalDate.now();
        this.motivoMov = motivoMov;
        this.usuario = usuario;
    }

    // Getters y Setters

    public Integer getIdMovStock() {
        return idMovStock;
    }

    public void setIdMovStock(Integer idMovStock) {
        this.idMovStock = idMovStock;
    }

    public Producto getProductoMov() {
        return productoMov;
    }

    public void setProductoMov(Producto productoMov) {
        this.productoMov = productoMov;
    }

    public double getCantidadMov() {
        return cantidadMov;
    }

    public void setCantidadMov(double cantidadMov) {
        this.cantidadMov = cantidadMov;
    }

    public String getTipoMov() {
        return tipoMov;
    }

    public void setTipoMov(String tipoMov) {
        this.tipoMov = tipoMov;
    }

    public LocalDate getFechaMov() {
        return fechaMov;
    }

    public String getMotivoMov() {
        return motivoMov;
    }

    public void setMotivoMov(String motivoMov) {
        this.motivoMov = motivoMov;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}