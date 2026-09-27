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

    public Integer getIdPermiso() {
        return idPermiso;
    }

    public void setIdPermiso(Integer idPermiso) {
        this.idPermiso = idPermiso;
    }

    public String getNombrePermiso() {
        return nombrePermiso;
    }

    public void setNombrePermiso(String nombrePermiso) {
        this.nombrePermiso = nombrePermiso;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getIdUsuarioCreacion() {
        return idUsuarioCreacion;
    }

    public void setIdUsuarioCreacion(Integer idUsuarioCreacion) {
        this.idUsuarioCreacion = idUsuarioCreacion;
    }

    public String getNombreUsuarioCreacion() {
        return nombreUsuarioCreacion;
    }

    public void setNombreUsuarioCreacion(String nombreUsuarioCreacion) {
        this.nombreUsuarioCreacion = nombreUsuarioCreacion;
    }

}
