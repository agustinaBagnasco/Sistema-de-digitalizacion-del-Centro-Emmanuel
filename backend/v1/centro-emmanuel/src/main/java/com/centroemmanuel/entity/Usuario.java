package com.centroemmanuel.entity;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
   
   @ManyToMany(fetch = FetchType.LAZY)
   @JoinTable(
       name = "usuario_permiso",
       joinColumns = @JoinColumn(name = "id_usuario"),
       inverseJoinColumns = @JoinColumn(name = "id_permiso")
   )
   @JsonIgnoreProperties({"usuarioCreacion", "usuarioModificacion"})
    private List<Permiso> permisos;

    public Usuario(){this.permisos = new ArrayList<>();}

    public Usuario(String pNombreUsuario, String pNombre, String pApellido, String pClave, String pEmail) {
        this.nombreUsuario = pNombreUsuario;
        this.nombre = pNombre;
        this.apellido = pApellido;
        this.clave = pClave;
        this.email = pEmail;
        this.permisos = new ArrayList<>();
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

    public List<Permiso> getPermisos(){return permisos;}
    public void setPermisos(List<Permiso> pPermisos){this.permisos = pPermisos;}
    //endregion
}
