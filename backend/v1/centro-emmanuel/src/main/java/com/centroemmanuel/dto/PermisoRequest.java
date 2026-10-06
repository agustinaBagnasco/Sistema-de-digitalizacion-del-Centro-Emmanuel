package com.centroemmanuel.dto;

public class PermisoRequest {
    private String nombrePermiso;
    private String descripcion;

    public PermisoRequest() {
    }

    //region Getters y Setters
    public String getNombrePermiso(){return nombrePermiso;}
    public void setNombrePermiso(String pNombrePermiso){this.nombrePermiso = pNombrePermiso;}

    public String getDescripcion(){return descripcion;}
    public void setDescripcion(String pDescripcion){this.descripcion = pDescripcion;}
    //endregion
}
