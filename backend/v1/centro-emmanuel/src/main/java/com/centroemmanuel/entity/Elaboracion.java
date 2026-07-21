package com.centroemmanuel.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Elaboracion {
    private int idElaboracion;
    private Producto productoElaborado;
    private double cantidadProducida;
    private LocalDate fechaProduccion;
    private Usuario usuario;
    private String observaciones;
    private List<DetalleElaboracion> detalles;

    public Elaboracion(){this.detalles = new ArrayList<>();}

    public Elaboracion(int pIdElaboracion, Producto pPorductoElaborado, double pCantidadProducida, Usuario pUsuario, String pObservaciones){
        this.idElaboracion = pIdElaboracion;
        this.productoElaborado = pPorductoElaborado;
        this.cantidadProducida = pCantidadProducida;
        this.fechaProduccion = LocalDate.now();
        this.usuario = pUsuario;
        this.observaciones = pObservaciones;
        this.detalles = new ArrayList<>();
    }

    public void RegistrarElaboracion(){}
    public void CalcularCosto(){}
    
    //region Getters y Setters
    public int getIdElaboracion(){return idElaboracion;}
    public void setIdElaboracion(int pIdElaboracion){this.idElaboracion = pIdElaboracion;}

    public Producto getProducto(){return productoElaborado;}
    public void setProducto(Producto pProductoElaborado){this.productoElaborado = pProductoElaborado;}

    public double getCantidadProducida(){return cantidadProducida;}
    public void setCantidadProducida(double pCantidadProducida){this.cantidadProducida = pCantidadProducida;}

    public LocalDate getFechaProduccion(){return fechaProduccion;}

    public Usuario getUsuario(){return usuario;}
    public void setUsuario(Usuario pUsuario){this.usuario = pUsuario;}

    public String getObservaciones(){return observaciones;}
    public void setObservaciones(String pObservaciones){this.observaciones = pObservaciones;}

    public List<DetalleElaboracion> getDetalleElaboraciones(){return detalles;}
    public void setDetalleElaboraciones(List<DetalleElaboracion> pDetalles){this.detalles = pDetalles;}
    //endregion
}
