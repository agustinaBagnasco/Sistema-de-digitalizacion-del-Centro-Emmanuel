package com.centroemmanuel.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
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
    @JoinColumn(name = "id_producto")
    private Producto productoElaborado;

    @Column(name = "cantidad_producida")
    private double cantidadProducida;

    @Column(name = "fecha_produccion")
    private LocalDate fechaProduccion;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(length = 500)
    private String observaciones;

    @OneToMany(mappedBy = "elaboracion",
               cascade = CascadeType.ALL,
               orphanRemoval = true)
    private List<DetalleElaboracion> detalles = new ArrayList<>();

    public Elaboracion(){}

    public Elaboracion(Integer idElaboracion,
                       Producto productoElaborado,
                       double cantidadProducida,
                       Usuario usuario,
                       String observaciones){

        this.idElaboracion = idElaboracion;
        this.productoElaborado = productoElaborado;
        this.cantidadProducida = cantidadProducida;
        this.fechaProduccion = LocalDate.now();
        this.usuario = usuario;
        this.observaciones = observaciones;
    }

    public void registrarElaboracion(){}

    public void calcularCosto(){}

    //region Getters y Setters
    public int getIdElaboracion(){return idElaboracion;}
    public void setIdElaboracion(int pIdElaboracion){this.idElaboracion = pIdElaboracion;}

    public Producto getProducto(){return productoElaborado;}
    public void setProducto(Producto pProductoElaborado){this.productoElaborado = pProductoElaborado;}

    public double getCantidadProducida(){return cantidadProducida;}
    public void setCantidadProducida(double pCantidadProducida){this.cantidadProducida = pCantidadProducida;}

    public LocalDate getFechaProduccion(){return fechaProduccion;}

    public Usuario getUsuario(){return usuario;}
    public void setUsuario(Usuario pUsuario){this.usuario = pUsuario;}

    public String getObservaciones(){return observaciones;}
    public void setObservaciones(String pObservaciones){this.observaciones = pObservaciones;}

    public List<DetalleElaboracion> getDetalleElaboraciones(){return detalles;}
    public void setDetalleElaboraciones(List<DetalleElaboracion> pDetalles){this.detalles = pDetalles;}
    //endregion
}
