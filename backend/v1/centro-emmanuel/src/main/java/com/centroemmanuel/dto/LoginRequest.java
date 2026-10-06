package com.centroemmanuel.dto;

public class LoginRequest {

    private String nombreUsuario;
    private String clave;

    public LoginRequest() {
    }

    //region Getters y Setters
    public String getNombreUsuario(){return nombreUsuario;}
    public void setNombreUsuario(String pNombreUsuario){this.nombreUsuario = pNombreUsuario;}

    public String getClave(){return clave;}
    public void setClave(String pClave){this.clave = pClave;}
    //endregion
}
