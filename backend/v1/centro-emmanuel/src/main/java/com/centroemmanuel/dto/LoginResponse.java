package com.centroemmanuel.dto;

public class LoginResponse {

    private boolean success;
    private String mensaje;
    private Integer idUsuario;
    private String nombre;

    public LoginResponse() {
    }

    public LoginResponse(
            boolean success,
            String mensaje,
            Integer idUsuario,
            String nombre) {

        this.success = success;
        this.mensaje = mensaje;
        this.idUsuario = idUsuario;
        this.nombre = nombre;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMensaje() {
        return mensaje;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public String getNombre() {
        return nombre;
    }
}