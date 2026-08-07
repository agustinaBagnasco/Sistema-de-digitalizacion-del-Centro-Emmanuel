package com.centroemmanuel.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "permiso")
public class Permiso {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permiso")
    private int idPermiso;


    @Column(name = "nombre_permiso", nullable = false, unique = true)
    private String nombrePermiso;


    @Column(name = "descripcion")
    private String descripcion;


    // Relación Permiso - Rol
    @ManyToMany(mappedBy = "permisos")
    private List<Rol> roles = new ArrayList<>();


    public Permiso(){}


    public Permiso(int pIdPermiso, String pNombrePermiso, String pDescripcion){

        this.idPermiso = pIdPermiso;
        this.nombrePermiso = pNombrePermiso;
        this.descripcion = pDescripcion;

    }


    // Getters y Setters

    public int getIdPermiso(){
        return idPermiso;
    }

    public void setIdPermiso(int idPermiso){
        this.idPermiso = idPermiso;
    }


    public String getNombrePermiso(){
        return nombrePermiso;
    }

    public void setNombrePermiso(String nombrePermiso){
        this.nombrePermiso = nombrePermiso;
    }


    public String getDescripcion(){
        return descripcion;
    }

    public void setDescripcion(String descripcion){
        this.descripcion = descripcion;
    }


    public List<Rol> getRoles(){
        return roles;
    }

    public void setRoles(List<Rol> roles){
        this.roles = roles;
    }
}