package com.centroemmanuel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categoria")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Integer idCategoria;

    @Column(name = "nombre_categoria", nullable = false)
    private String nombreCategoria;

    @Column(name = "descripcion")
    private String descripcion;

    public Categoria() {
    }

    public Categoria(Integer pIdCategoria, String pNombreCategoria, String pDescripcion) {
        this.idCategoria = pIdCategoria;
        this.nombreCategoria = pNombreCategoria;
        this.descripcion = pDescripcion;
    }

    // Getters y Setters
    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer pIdCategoria) {
        this.idCategoria = pIdCategoria;
    }

    public String getNombreCategoria() {
        return nombreCategoria;
    }

    public void setNombreCategoria(String pNombreCategoria) {
        this.nombreCategoria = pNombreCategoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String pDescripcion) {
        this.descripcion = pDescripcion;
    }
}