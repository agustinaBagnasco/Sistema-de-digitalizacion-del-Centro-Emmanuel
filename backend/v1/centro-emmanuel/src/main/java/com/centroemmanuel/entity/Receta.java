// package.com.centroemmanuel.entity;
// package.jakarta.persistence.*;
// package.java.time.LocalDate;
// package.java.util.ArrayList;
// package.java.util.List;

// @Entity
// @Table(name = "receta")
// public class Receta {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "id_receta")
//     private Integer idReceta;

//     @ManyToOne
//     @JoinColumn(name = "id_producto")
//     private Producto producto;

//     @ManyToOne
//     @JoinColumn(name = "nombre_receta")
//     private NombreReceta nombreReceta;

//     @Column(name = "descripcion_receta", length = 500)
//     private String descripcionReceta;

//     @Column(name = "activo", nullable = false)
//     private Boolean activo;

//     @ONEToMany(mappedBy = "receta",
//                cascade = CascadeType.ALL,
//                orphanRemoval = true)
//     private List<DetalleReceta> detalles = new ArrayList<>();

//     public Receta(){}

//     public Receta(Integer idReceta,
//                   Producto producto,
//                   NombreReceta nombreReceta,
//                   String descripcionReceta){

//         this.idReceta = idReceta;
//         this.producto = producto;
//         this.nombreReceta = nombreReceta;
//         this.descripcionReceta = descripcionReceta;
//         this.activo = true;
//     }

//     }

//     //region Getters y Setters
//     public int getIdReceta(){return idReceta;}

//     public void setIdReceta(int idReceta){this.idReceta = idReceta;}

//     public Producto getProducto(){return producto;}

//     public void setProducto(Producto producto){this.producto = producto;}

//     public NombreReceta getNombreReceta(){return nombreReceta;}

//     public void setNombreReceta(NombreReceta nombreReceta){this.nombreReceta = nombreReceta;}

//     public String getDescripcionReceta(){return descripcionReceta;}

//     public void setDescripcionReceta(String descripcionReceta){this.descripcionReceta = descripcionReceta;}

//     public Boolean getActivo(){return activo;}

//     public void setActivo(Boolean activo){this.activo = activo;}



package com.centroemmanuel.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "receta")
public class Receta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_receta")
    private Integer idReceta;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;

   @Column(name = "nombre_receta", nullable = false)
private String nombreReceta;

    @Column(name = "descripcion_receta", length = 500)
    private String descripcionReceta;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    @OneToMany(
        mappedBy = "receta",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<DetalleReceta> detalles = new ArrayList<>();

    public Receta() {
    }

    public Receta(
            Integer idReceta,
            Producto producto,
            String nombreReceta,
            String descripcionReceta
    ) {
        this.idReceta = idReceta;
        this.producto = producto;
        this.nombreReceta = nombreReceta;
        this.descripcionReceta = descripcionReceta;
        this.activo = true;
    }

    // Getters y Setters

    public Integer getIdReceta() {
        return idReceta;
    }

    public void setIdReceta(Integer idReceta) {
        this.idReceta = idReceta;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public String getNombreReceta() {
        return nombreReceta;
    }

    public void setNombreReceta(String nombreReceta) {
        this.nombreReceta = nombreReceta;
    }

    public String getDescripcionReceta() {
        return descripcionReceta;
    }

    public void setDescripcionReceta(String descripcionReceta) {
        this.descripcionReceta = descripcionReceta;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public List<DetalleReceta> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleReceta> detalles) {
        this.detalles = detalles;
    }
}