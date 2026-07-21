package com.centroemmanuel.entity;

import java.time.LocalDate;

public class MovimientoStock {
    private int idMovStock;
    private Producto productoMov;
    private double cantidadMov;
    private String tipoMov;
    private LocalDate fechaMov;
    private String motivoMov;
    private Usuario usuario;

    public MovimientoStock(){}

    public MovimientoStock(int pIdMovStock, Producto pProductoMov, double pCantidadMov, String pTipoMov, String pMotivoMov, Usuario pUsuario){
        this.idMovStock = pIdMovStock;
        this.productoMov = pProductoMov;
        this.cantidadMov = pCantidadMov;
        this.tipoMov = pMotivoMov;
        this.fechaMov = LocalDate.now();
        this.motivoMov = pMotivoMov;
        this.usuario = pUsuario;
    }

    //region Getters y Setters
    public int getIdMovStock(){return idMovStock;}
    public void setIdMovStock(int pIdMovStock){this.idMovStock = pIdMovStock;}

    public Producto getProdructoMov(){return productoMov;}
    public void setProductoMov(Producto prProductoMov){this.productoMov = prProductoMov;}

    public double getCantidadMov(){return cantidadMov;}
    public void setCantidadMov(double pCantidadMov){this.cantidadMov = pCantidadMov;}

    public String getTipoMov(){return tipoMov;}
    public void setTipoMov(String pTipoMov){this.tipoMov = pTipoMov;}

    public LocalDate getFechaMov(){return fechaMov;}

    public String getMotivoMov(){return motivoMov;}
    public void setMotivoMov(String pMotivoMov){this.motivoMov = pMotivoMov;}

    public Usuario getUsuario(){return usuario;}
    public void setUsuario(Usuario pUsuario){this.usuario = pUsuario;}
    //endregion
}
