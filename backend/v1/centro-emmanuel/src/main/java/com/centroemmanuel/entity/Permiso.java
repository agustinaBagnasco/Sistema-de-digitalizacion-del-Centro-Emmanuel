package com.centroemmanuel.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "permiso")
public class Permiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permiso")
    private int idPermiso;

    @Column(name = "nombre_permiso", nullable = false, unique = true)
    private String nombrePermiso;

    @Column(name = "descripcion")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_creacion")
    @JsonIgnoreProperties({"clave", "permisos"})
    private Usuario usuarioCreacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_modificacion")
    @JsonIgnoreProperties({"clave", "permisos"})
    private Usuario usuarioModificacion;

    public Permiso(){}

    //Permisos va a tener que conectarse a cada pagina del front para administrar el acceso o no a la pagina
    public Permiso(int pIdPermiso, String pNombrePermiso, String pDescripcion){

        this.idPermiso = pIdPermiso;
        this.nombrePermiso = pNombrePermiso;
        this.descripcion = pDescripcion;

    }

    //region Getters y Setters
    public int getIdPermiso(){return idPermiso;}
    public void setIdPermiso(int pIdPermiso){this.idPermiso = pIdPermiso;}

    public String getNombrePermiso(){return nombrePermiso;}
    public void setNombrePermiso(String pNombrePermiso){this.nombrePermiso = pNombrePermiso;}

    public String getDescripcion(){return descripcion;}
    public void setDescripcion(String pDescripcion){this.descripcion = pDescripcion;}

    public Usuario getUsuarioCreacion(){return usuarioCreacion;}
    public void setUsuarioCreacion(Usuario pUsuarioCreacion){this.usuarioCreacion = pUsuarioCreacion;}

    public Usuario getUsuarioModificacion(){return usuarioModificacion;}
    public void setUsuarioModificacion(Usuario pUsuarioModificacion){this.usuarioModificacion = pUsuarioModificacion;}
    //endregion
}
