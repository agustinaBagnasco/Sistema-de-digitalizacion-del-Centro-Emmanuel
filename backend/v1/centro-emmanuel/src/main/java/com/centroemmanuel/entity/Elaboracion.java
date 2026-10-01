package com.centroemmanuel.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "elaboracion")
public class Elaboracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_elaboracion")
    private Integer idElaboracion;

    // Producto que se está elaborando
    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto productoElaborado;

    // Fecha en que se realizó la elaboración
    @Column(name = "fecha_elaboracion", nullable = false)
    private LocalDate fechaElaboracion;

    // Tiempo total de elaboración, expresado en minutos
    @Column(name = "tiempo_elaboracion")
    private Integer tiempoElaboracion;

    // Cantidad obtenida del producto elaborado
    @Column(name = "cantidad_producida", nullable = false, precision = 15, scale = 3)
    private BigDecimal cantidadProducida;

       @Column(name = "cantidad_frascos_1kg")
private Integer cantidadFrascos1kg;

@Column(name = "cantidad_frascos_420g")
private Integer cantidadFrascos420g;


    // Usuario que registra/realiza la elaboración
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

 
    @Column(length = 500)
    private String observaciones;

    // Insumos utilizados durante esta elaboración
    @OneToMany(
        mappedBy = "elaboracion",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<DetalleElaboracion> detalles = new ArrayList<>();

    // Productos obtenidos en cada presentación de esta elaboración
    @ManyToOne
    @JoinColumn(name = "id_producto_1kg")
    private Producto productoElaborado1kg;

    @ManyToOne
    @JoinColumn(name = "id_producto_420g")
    private Producto productoElaborado420g;


    // =========================
    // CONSTRUCTORES
    // =========================

    public Elaboracion() {
    }


    // =========================
    // GETTERS Y SETTERS
    // =========================

    public Integer getIdElaboracion() {
        return idElaboracion;
    }

    public void setIdElaboracion(Integer idElaboracion) {
        this.idElaboracion = idElaboracion;
    }

    public Producto getProductoElaborado() {
        return productoElaborado;
    }

    public void setProductoElaborado(Producto productoElaborado) {
        this.productoElaborado = productoElaborado;
    }

    public LocalDate getFechaElaboracion() {
        return fechaElaboracion;
    }

    public void setFechaElaboracion(LocalDate fechaElaboracion) {
        this.fechaElaboracion = fechaElaboracion;
    }

    public Integer getTiempoElaboracion() {
        return tiempoElaboracion;
    }

    public void setTiempoElaboracion(Integer tiempoElaboracion) {
        this.tiempoElaboracion = tiempoElaboracion;
    }

    public BigDecimal getCantidadProducida() {
        return cantidadProducida;
    }

    public void setCantidadProducida(BigDecimal cantidadProducida) {
        this.cantidadProducida = cantidadProducida;
    }

    public Integer getCantidadFrascos1kg() {
    return cantidadFrascos1kg;
}

public void setCantidadFrascos1kg(Integer cantidadFrascos1kg) {
    this.cantidadFrascos1kg = cantidadFrascos1kg;
}

public Integer getCantidadFrascos420g() {
    return cantidadFrascos420g;
}

public void setCantidadFrascos420g(Integer cantidadFrascos420g) {
    this.cantidadFrascos420g = cantidadFrascos420g;
}

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public List<DetalleElaboracion> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleElaboracion> detalles) {
        this.detalles = detalles;
    }

    public Producto getProductoElaborado1kg() {
        return productoElaborado1kg;
    }

    public void setProductoElaborado1kg(Producto productoElaborado1kg) {
        this.productoElaborado1kg = productoElaborado1kg;
    }

    public Producto getProductoElaborado420g() {
        return productoElaborado420g;
    }

    public void setProductoElaborado420g(Producto productoElaborado420g) {
        this.productoElaborado420g = productoElaborado420g;
    }
}