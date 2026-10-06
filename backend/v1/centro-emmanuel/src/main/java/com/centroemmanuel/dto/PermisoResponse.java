package com.centroemmanuel.dto;

public class PermisoResponse {
    private Integer idPermiso;
    private String nombrePermiso;
    private String descripcion;
    private Integer idUsuarioCreacion;
    private String nombreUsuarioCreacion;

    public PermisoResponse() {
    }

    public PermisoResponse(Integer idPermiso, String nombrePermiso, String descripcion,
            Integer idUsuarioCreacion, String nombreUsuarioCreacion) {
        this.idPermiso = idPermiso;
        this.nombrePermiso = nombrePermiso;
        this.descripcion = descripcion;
        this.idUsuarioCreacion = idUsuarioCreacion;
        this.nombreUsuarioCreacion = nombreUsuarioCreacion;
    }

    //region Getters y Setters
    public Integer getIdPermiso(){return idPermiso;}
    public void setIdPermiso(Integer pIdPermiso){this.idPermiso = pIdPermiso;}

    public String getNombrePermiso(){return nombrePermiso;}
    public void setNombrePermiso(String pNombrePermiso){this.nombrePermiso = pNombrePermiso;}

    public String getDescripcion(){return descripcion;}
    public void setDescripcion(String pDescripcion){this.descripcion = pDescripcion;}

    public Integer getIdUsuarioCreacion(){return idUsuarioCreacion;}
    public void setIdUsuarioCreacion(Integer pIdUsuarioCreacion){this.idUsuarioCreacion = pIdUsuarioCreacion;}

    public String getNombreUsuarioCreacion(){return nombreUsuarioCreacion;}
    public void setNombreUsuarioCreacion(String pNombreUsuarioCreacion){this.nombreUsuarioCreacion = pNombreUsuarioCreacion;}
    //endregion
}
