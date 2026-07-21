package com.centroemmanuel.entity;


public class Usuario {
    private int idUsuario;
    private String nombreUsuario;
    private String nombre;
    private String apellido;
    private String clave;
    private String email;
    private boolean activo;
    private Rol rol;

    public Usuario(){}

    public Usuario(int pIdUsuario, String pNombreUsuario, String pNombre, String pApellido, String pClave, String pEmail, Boolean pActivo, Rol pRrol){
        this.idUsuario = pIdUsuario;
        this.nombreUsuario = pNombreUsuario;
        this.nombre = pNombre;
        this.apellido = pApellido;
        this.clave = pClave;
        this.email = pEmail;
        this.activo = pActivo;
        this.rol = pRrol;   
    }

    public void IniciarSesion(){}

    public void CambiarClave(){}

    //region Getters y Setters
    public int getIdUsuario(){return idUsuario;}
    public void setIdUsuario(int pIdUsuario){this.idUsuario = pIdUsuario;}

    public String getNombreUsuario(){return nombreUsuario;}
    public void setNombreUsuario(String pNombreUsuario){this.nombreUsuario = pNombreUsuario;}

    public String getNombre(){return nombre;}
    public void setNombre(String pNombre){this.nombre = pNombre;}

    public String getApellido(){return apellido;}
    public void setApellido(String pApellido){this.apellido = pApellido;}

    public String getClave(){return clave;}
    public void setClave(String pClave){this.clave = pClave;}

    public String getEmail(){return email;}
    public void setEmail(String pEmail){this.email = pEmail;}
    
    public boolean isActivo(){return activo;}
    public void setActivo(boolean pActivo){this.activo = pActivo;}
    
    public Rol getRol(){return rol;}
    public void setRol(Rol pRol){this.rol = pRol;}
    //endregion
}
