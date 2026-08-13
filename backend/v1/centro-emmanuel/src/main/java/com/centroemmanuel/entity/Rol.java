package com.centroemmanuel.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private int idRol;


    @Column(name = "nombre_rol", nullable = false, unique = true)
    private String nombreRol;


    @Column(name = "descripcion")
    private String descripcion;


    // Relación Rol - Permiso
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "rol_permiso",
        joinColumns = @JoinColumn(name = "id_rol"),
        inverseJoinColumns = @JoinColumn(name = "id_permiso")
    )
    private List<Permiso> permisos = new ArrayList<>();


    // Relación Rol - Usuario
@ManyToMany(mappedBy = "roles")
@JsonIgnore
private List<Usuario> usuarios = new ArrayList<>();

    public Rol(){}


    public Rol(int pIdRol, String pNombreRol, String pDescripcion){

        this.idRol = pIdRol;
        this.nombreRol = pNombreRol;
        this.descripcion = pDescripcion;
        this.permisos = new ArrayList<>();
        this.usuarios = new ArrayList<>();

    }


    // Getters y Setters

    public int getIdRol(){
        return idRol;
    }

    public void setIdRol(int idRol){
        this.idRol = idRol;
    }


    public String getNombreRol(){
        return nombreRol;
    }

    public void setNombreRol(String nombreRol){
        this.nombreRol = nombreRol;
    }


    public String getDescripcion(){
        return descripcion;
    }

    public void setDescripcion(String descripcion){
        this.descripcion = descripcion;
    }


    public List<Permiso> getPermisos(){
        return permisos;
    }

    public void setPermisos(List<Permiso> permisos){
        this.permisos = permisos;
    }


    public List<Usuario> getUsuarios(){
        return usuarios;
    }

    public void setUsuarios(List<Usuario> usuarios){
        this.usuarios = usuarios;
    }
}