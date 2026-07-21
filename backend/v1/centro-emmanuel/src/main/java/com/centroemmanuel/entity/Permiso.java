package com.centroemmanuel.entity;

public class Permiso {
    private int idPermiso;
    private String nombrePermiso;
    private String descripcion;

    public Permiso(){}

    public Permiso(int pIdPermiso, String pNombrePermiso, String pDescripcion){
        this.idPermiso = pIdPermiso;
        this.nombrePermiso = pNombrePermiso;
        this.descripcion = pDescripcion;
    }

    //region Getters y Setters
    public int getIdPermiso(){return idPermiso;}
    public void setIdPermiso(int pIdPermiso){this.idPermiso = pIdPermiso;}

    public String getNombrePermiso(){return nombrePermiso;}
    public void setNombrePermiso(String pNombrePermiso){this.nombrePermiso = pNombrePermiso;}
    
    public String getDescripcion(){return descripcion;}
    public void setDescripcion(String pDescripcion){this.descripcion = pDescripcion;}
    //endregion
}
