package com.centroemmanuel.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Venta {
    private int idVenta;
    private BigDecimal total;
    private LocalDate fechaVenta;
    private Usuario usuario;
    private List<DetalleVenta> detalles;

    public Venta(){}

    public Venta(int pIdVenta, BigDecimal pTotal, Usuario pUsuario, List<DetalleVenta> pDetalle){
        this.idVenta = pIdVenta;
        this.total = pTotal;
        this.fechaVenta = LocalDate.now();
        this.usuario = pUsuario;
        this.detalles = new ArrayList<>();
    }

    public void RegistrarVenta(){}

    //region Getters y Setters
    public int getIdVenta(){return idVenta;}
    public void setIdVenta(int pIdVenta){this.idVenta = pIdVenta;}

    public BigDecimal getTotal(){return total;}
    public void setTotal(BigDecimal pTotal){this.total = pTotal;}

    public LocalDate getFechaVenta(){return fechaVenta;}

    public Usuario getUsuario(){return usuario;}
    public void setUsuario(Usuario pUsuario){this.usuario = pUsuario;}

    public List<DetalleVenta> getDetalleVenta(){return detalles;}
    public void setDetalleVenta(List<DetalleVenta> pDetalles){this.detalles = pDetalles;}
    //endregion
}
