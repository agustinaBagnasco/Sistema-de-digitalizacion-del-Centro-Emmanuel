package com.centroemmanuel.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
//import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private int idUsuario;


    @Column(name = "nombre_usuario", nullable = false, unique = true)
    private String nombreUsuario;


    @Column(name = "nombre")
    private String nombre;


    @Column(name = "apellido")
    private String apellido;


    @Column(name = "clave")
    private String clave;


    @Column(name = "email")
    private String email;


    @Column(name = "activo")
    private boolean activo;


    // Un usuario puede tener varios roles

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "usuario_rol",
        joinColumns = @JoinColumn(name = "id_usuario"),
        inverseJoinColumns = @JoinColumn(name = "id_rol")
    )
    //@JsonManagedReference
    private List<Rol> roles = new ArrayList<>();


    public Usuario(){}


    public Usuario(int pIdUsuario, 
                   String pNombreUsuario, 
                   String pNombre, 
                   String pApellido, 
                   String pClave, 
                   String pEmail, 
                   Boolean pActivo){

        this.idUsuario = pIdUsuario;
        this.nombreUsuario = pNombreUsuario;
        this.nombre = pNombre;
        this.apellido = pApellido;
        this.clave = pClave;
        this.email = pEmail;
        this.activo = pActivo;
    }


    public void IniciarSesion(){}

    public void CambiarClave(){}


    // Getters y Setters

    public int getIdUsuario(){
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario){
        this.idUsuario = idUsuario;
    }


    public String getNombreUsuario(){
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario){
        this.nombreUsuario = nombreUsuario;
    }


    public String getNombre(){
        return nombre;
    }

    public void setNombre(String nombre){
        this.nombre = nombre;
    }


    public String getApellido(){
        return apellido;
    }

    public void setApellido(String apellido){
        this.apellido = apellido;
    }


    public String getClave(){
        return clave;
    }

    public void setClave(String clave){
        this.clave = clave;
    }


    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    }


    public boolean isActivo(){
        return activo;
    }

    public void setActivo(boolean activo){
        this.activo = activo;
    }


    public List<Rol> getRoles(){
        return roles;
    }

    public void setRoles(List<Rol> roles){
        this.roles = roles;
    }
}