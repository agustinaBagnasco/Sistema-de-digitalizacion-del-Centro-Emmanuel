package com.centroemmanuel.dto;

import java.util.List;

public class LoginResponse {

    private boolean success;
    private String mensaje;
    private Integer idUsuario;
    private String nombre;
    private List<Integer> permisos;

    public LoginResponse() {
    }

    public LoginResponse(
            boolean success,
            String mensaje,
            Integer idUsuario,
            String nombre,
            List<Integer> permisos) {

        this.success = success;
        this.mensaje = mensaje;
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.permisos = permisos;
    }

    //region Getters y Setters
    public boolean isSuccess(){return success;}

    public String getMensaje(){return mensaje;}

    public Integer getIdUsuario(){return idUsuario;}

    public String getNombre(){return nombre;}

    public List<Integer> getPermisos(){return permisos;}
    //endregion
}
