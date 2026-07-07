package com.centroemmanuel.entity;

import java.time.LocalDate;

public class Cosecha {
    private int idCosecha;
    private Producto productoCosecha;
    private double cantidadCosecha;
    private LocalDate fechaCosecha;
    private String observaciones;
    private Usuario usuario;

    public Cosecha(){}

    public Cosecha(int pIdCosecha, Producto pProdcutoCosecha, double pCantidadCosecha, String pObservaciones, Usuario pUsuario){
        this.idCosecha = pIdCosecha;
        this.productoCosecha = pProdcutoCosecha;
        this.cantidadCosecha = pCantidadCosecha;
        this.fechaCosecha = LocalDate.now();
        this.observaciones = pObservaciones;
        this.usuario = pUsuario;
    }

    //region Getters y Setters
    public int getIdCosecha(){return idCosecha;}
    public void setIdCosecha(int pIdCosecha){this.idCosecha = pIdCosecha;}

    public Producto getProductoCosecha(){return productoCosecha;}
    public void setProductoCosecha(Producto pProductoCosecha){this.productoCosecha = pProductoCosecha;}

    public double getCantidadCosecha(){return cantidadCosecha;}
    public void setCantidadCosecha(double pCantidadCosecha){this.cantidadCosecha = pCantidadCosecha;}

    public LocalDate getFechaCosecha(){return fechaCosecha;}

    public String getObservaciones(){return observaciones;}
    public void setObservaciones(String pObservaciones){this.observaciones = pObservaciones;}

    public Usuario getUsuario(){return usuario;}
    public void setUsuario(Usuario pUsuario){this.usuario = pUsuario;}
    //endregion
}
