package com.centroemmanuel.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cosecha")
public class Cosecha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cosecha")
    private Integer idCosecha;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto productoCosecha;

    @Column(name = "cantidad_cosecha", nullable = false)
    private double cantidadCosecha;

    @Column(name = "fecha_cosecha")
    private LocalDate fechaCosecha;

    @Column(length = 500)
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    public Cosecha(){}

    public Cosecha(Integer idCosecha, Producto productoCosecha, double cantidadCosecha,
                   String observaciones, Usuario usuario){
        this.idCosecha = idCosecha;
        this.productoCosecha = productoCosecha;
        this.cantidadCosecha = cantidadCosecha;
        this.fechaCosecha = LocalDate.now();
        this.observaciones = observaciones;
        this.usuario = usuario;
    }
    
    //region Getters y Setters
    public int getIdCosecha(){return idCosecha;}
    public void setIdCosecha(int pIdCosecha){this.idCosecha = pIdCosecha;}

    public Producto getProductoCosecha(){return productoCosecha;}
    public void setProductoCosecha(Producto pProductoCosecha){this.productoCosecha = pProductoCosecha;}

    public double getCantidadCosecha(){return cantidadCosecha;}
    public void setCantidadCosecha(double pCantidadCosecha){this.cantidadCosecha = pCantidadCosecha;}

    public LocalDate getFechaCosecha(){return fechaCosecha;}

    public String getObservaciones(){return observaciones;}
    public void setObservaciones(String pObservaciones){this.observaciones = pObservaciones;}

    public Usuario getUsuario(){return usuario;}
    public void setUsuario(Usuario pUsuario){this.usuario = pUsuario;}
    //endregion
}
