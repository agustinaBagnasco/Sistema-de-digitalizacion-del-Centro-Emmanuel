package com.centroemmanuel.entity;

import java.util.ArrayList;
import java.util.List;

public class Rol {
    private int idRol;
    private String nombreRol;
    private String descripcion;
    private List<Permiso> permisos;

    public Rol(){}

    public Rol(int pIdRol, String pNombreRol, String pDescripcion){
        this.idRol = pIdRol;
        this.nombreRol = pNombreRol;
        this.descripcion = pDescripcion;
        this.permisos = new ArrayList<>();
    }

    //region Getters y Setters
    public int getIdRol(){return idRol;}
    public void setIdRol(int pIdRol){this.idRol = pIdRol;}

    public String getNombreRol(){return nombreRol;}
    public void setNombreRol(String pNombreRol){this.nombreRol = pNombreRol;}

    public String getDescripcion(){return descripcion;}
    public void setDescripcion(String pDescripcion){this.descripcion = pDescripcion;}
    
    public List<Permiso> getPermisos(){return permisos;}
    public void setPermisos(List<Permiso> pPermisos){this.permisos = pPermisos;}
    //public void agregarPermiso(Permiso pPermiso){permisos.add(pPermiso);} La idea es ya tener la lista armadas de los permisos generales de cada rol
    //public void quitarPermiso(Permiso pPermiso){permisos.remove(pPermiso);} no tener que agregarlos o quitarlos manualmente
    //endregion
}
