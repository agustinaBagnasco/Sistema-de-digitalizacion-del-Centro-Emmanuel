// package.com.centroemmanuel.entity;
// package.jakarta.persistence.*;

// @Entity
// @Table(name = "detalle_receta")
// public class DetalleReceta {
    
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "id_detalle_receta")
//     private Integer idDetalleReceta;

//     @ManyToOne
//     @JoinColumn(name = "id_receta")
//     private Receta receta;

//     @ManyToOne
//     @JoinColumn(name = "id_producto")
//     private Producto insumoUtilizado;

//     @Column(name = "cantidad_utilizada")
//     private double cantidadUtilizada;

//     public DetalleReceta(){}

//     public DetalleReceta(Integer idDetalleReceta,
//                          Receta receta,
//                          Producto insumoUtilizado,
//                          double cantidadUtilizada){
//         this.idDetalleReceta = idDetalleReceta;
//         this.receta = receta;
//         this.insumoUtilizado = insumoUtilizado;
//         this.cantidadUtilizada = cantidadUtilizada;
//     }

//     //region Getters y Setters
//     public int getIdDetalleReceta(){return idDetalleReceta;}
//     public void setIdDetalleReceta(int pIdDetalleReceta){this.idDetalleReceta = pIdDetalleReceta;}

//     public Producto getInsumoUtilizado(){return insumoUtilizado;}
//     public void setInsumoUtilizado(Producto pInsumoUtilizado){this.insumoUtilizado = pInsumoUtilizado;} 

//     public double getCantidadUtilizada(){return cantidadUtilizada;}
//     public void setCantidadUtilizada(double pCantidadUtilizada){this.cantidadUtilizada = pCantidadUtilizada;}
    
//     public Receta getReceta(){return receta;}
//     public void setReceta(Receta receta){this.receta = receta;}
//     //endregion
// }


package com.centroemmanuel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "detalle_receta")
public class DetalleReceta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_receta")
    private Integer idDetalleReceta;

    @ManyToOne
    @JoinColumn(name = "id_receta")
    private Receta receta;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto insumoUtilizado;

    @Column(name = "cantidad_utilizada")
    private Double cantidadUtilizada;

    public DetalleReceta() {
    }

    public DetalleReceta(
            Integer idDetalleReceta,
            Receta receta,
            Producto insumoUtilizado,
            Double cantidadUtilizada
    ) {
        this.idDetalleReceta = idDetalleReceta;
        this.receta = receta;
        this.insumoUtilizado = insumoUtilizado;
        this.cantidadUtilizada = cantidadUtilizada;
    }

    // Getters y Setters

    public Integer getIdDetalleReceta() {
        return idDetalleReceta;
    }

    public void setIdDetalleReceta(Integer idDetalleReceta) {
        this.idDetalleReceta = idDetalleReceta;
    }

    public Receta getReceta() {
        return receta;
    }

    public void setReceta(Receta receta) {
        this.receta = receta;
    }

    public Producto getInsumoUtilizado() {
        return insumoUtilizado;
    }

    public void setInsumoUtilizado(Producto insumoUtilizado) {
        this.insumoUtilizado = insumoUtilizado;
    }

    public Double getCantidadUtilizada() {
        return cantidadUtilizada;
    }

    public void setCantidadUtilizada(Double cantidadUtilizada) {
        this.cantidadUtilizada = cantidadUtilizada;
    }
}