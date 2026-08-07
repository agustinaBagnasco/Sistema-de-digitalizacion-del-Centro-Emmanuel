package com.centroemmanuel.dto;

public class LoginResponse {

    private boolean success;
    private String mensaje;
    private String nombre;

    public LoginResponse() {
    }

    public LoginResponse(boolean success, String mensaje, String nombre) {
        this.success = success;
        this.mensaje = mensaje;
        this.nombre = nombre;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMensaje() {
        return mensaje;
    }

    public String getNombre() {
        return nombre;
    }
}