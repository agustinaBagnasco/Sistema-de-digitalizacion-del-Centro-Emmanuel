package com.centroemmanuel.entity;

public class Categoria {
    private int idCategoria;
    private String nombreCategoria;
    private String descripcion;

    public Categoria(){}

    public Categoria(int pIdCategoria, String pNombreCategoria, String pDescripcion){
        this.idCategoria = pIdCategoria;
        this.nombreCategoria = pNombreCategoria;
        this.descripcion = pDescripcion;
    }

    //region Getters y Setters
    public int getIdCategoria(){return idCategoria;}
    public void setIdCategoria(int pIdCategoria){this.idCategoria = pIdCategoria;}

    public String getNombreCategoria(){return nombreCategoria;}
    public void setNombreCategoria(String pNombreCategoria){this.nombreCategoria = pNombreCategoria;}

    public String getDescripcionCategoria(){return descripcion;}
    public void setDescripcionCategoria(String pDescripcion){this.descripcion = pDescripcion;}
    //endregion
}
