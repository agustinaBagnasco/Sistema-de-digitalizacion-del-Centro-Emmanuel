package com.centroemmanuel.entity;

import java.math.BigDecimal;

public class DetalleElaboracion {
    private int idDetalleElaboracion;
    private Producto insumoUtilizado;
    private double cantidadUtilizada;
    private BigDecimal costoUnitario;

    public DetalleElaboracion(){}

    public DetalleElaboracion(int pIdDetalleElaboracion, Producto pInsumoUtilizado, double pCantidadProducida, BigDecimal pCostoUnitario){
        this.idDetalleElaboracion = pIdDetalleElaboracion;
        this.insumoUtilizado = pInsumoUtilizado;
        this.cantidadUtilizada = pCantidadProducida;
        this.costoUnitario = pCostoUnitario;
    }

    //region Getters y Setters
    public int getIdDetalleElaboracion(){return idDetalleElaboracion;}
    public void setIdDetalleElaboracion(int pIdDetalleElaboracion){this.idDetalleElaboracion = pIdDetalleElaboracion;}

    public Producto getInsumoUtilizado(){return insumoUtilizado;}
    public void setInsumoUtilizado(Producto pInsumoUtilizado){this.insumoUtilizado = pInsumoUtilizado;}

    public double getCantidadUtilizada(){return cantidadUtilizada;}
    public void setCantidadUtilizada(double pCantidadUtilizada){this.cantidadUtilizada = pCantidadUtilizada;}

    public BigDecimal getCostoUnitario(){return costoUnitario;}
    public void setCostoUnitario(BigDecimal pCostoUnitario){this.costoUnitario = pCostoUnitario;}
    //endregion
}
