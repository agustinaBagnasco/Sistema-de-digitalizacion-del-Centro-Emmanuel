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

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto productoElaborado;

    @Column(name = "fecha_elaboracion", nullable = false)
    private LocalDate fechaElaboracion;

    @Column(name = "tiempo_elaboracion")
    private Integer tiempoElaboracion;

    @Column(name = "cantidad_producida", nullable = false, precision = 15, scale = 3)
    private BigDecimal cantidadProducida;

    @Column(name = "cantidad_hormas")
    private Integer cantidadHormas;

       @Column(name = "cantidad_frascos_1kg")
private Integer cantidadFrascos1kg;

@Column(name = "cantidad_frascos_420g")
private Integer cantidadFrascos420g;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(length = 500)
    private String observaciones;

    @OneToMany(
        mappedBy = "elaboracion",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<DetalleElaboracion> detalles = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "id_producto_1kg")
    private Producto productoElaborado1kg;

    @ManyToOne
    @JoinColumn(name = "id_producto_420g")
    private Producto productoElaborado420g;

    public Elaboracion() {
    }

    //region Getters y Setters
    public Integer getIdElaboracion(){return idElaboracion;}
    public void setIdElaboracion(Integer pIdElaboracion){this.idElaboracion = pIdElaboracion;}

    public Producto getProductoElaborado(){return productoElaborado;}
    public void setProductoElaborado(Producto pProductoElaborado){this.productoElaborado = pProductoElaborado;}

    public LocalDate getFechaElaboracion(){return fechaElaboracion;}
    public void setFechaElaboracion(LocalDate pFechaElaboracion){this.fechaElaboracion = pFechaElaboracion;}

    public Integer getTiempoElaboracion(){return tiempoElaboracion;}
    public void setTiempoElaboracion(Integer pTiempoElaboracion){this.tiempoElaboracion = pTiempoElaboracion;}

    public BigDecimal getCantidadProducida(){return cantidadProducida;}
    public void setCantidadProducida(BigDecimal pCantidadProducida){this.cantidadProducida = pCantidadProducida;}

    public Integer getCantidadHormas(){return cantidadHormas;}
    public void setCantidadHormas(Integer pCantidadHormas){this.cantidadHormas = pCantidadHormas;}

    public Integer getCantidadFrascos1kg(){return cantidadFrascos1kg;}
    public void setCantidadFrascos1kg(Integer pCantidadFrascos1kg){this.cantidadFrascos1kg = pCantidadFrascos1kg;}

    public Integer getCantidadFrascos420g(){return cantidadFrascos420g;}
    public void setCantidadFrascos420g(Integer pCantidadFrascos420g){this.cantidadFrascos420g = pCantidadFrascos420g;}

    public Usuario getUsuario(){return usuario;}
    public void setUsuario(Usuario pUsuario){this.usuario = pUsuario;}

    public String getObservaciones(){return observaciones;}
    public void setObservaciones(String pObservaciones){this.observaciones = pObservaciones;}

    public List<DetalleElaboracion> getDetalles(){return detalles;}
    public void setDetalles(List<DetalleElaboracion> pDetalles){this.detalles = pDetalles;}

    public Producto getProductoElaborado1kg(){return productoElaborado1kg;}
    public void setProductoElaborado1kg(Producto pProductoElaborado1kg){this.productoElaborado1kg = pProductoElaborado1kg;}

    public Producto getProductoElaborado420g(){return productoElaborado420g;}
    public void setProductoElaborado420g(Producto pProductoElaborado420g){this.productoElaborado420g = pProductoElaborado420g;}
    //endregion
}
