package com.centroemmanuel.entity;
import java.time.LocalDate;

public class Reporte {
    private int idReporte;
    private LocalDate fechaGeneracion;
    private String tipoReporte;
    private Usuario usuario;

    public Reporte(){}
    
    public Reporte(int pIdReporte, String pTipoReporte, Usuario pUsuario){
        this.idReporte = pIdReporte;
        this.fechaGeneracion = LocalDate.now();
        this.tipoReporte = pTipoReporte;
        this.usuario = pUsuario;
    }

    public void GenerarReporte(){}
    public void ExportarPDF(){}
    public void ExportarExcel(){}

    //region Getters y Setters
    public int getIdReporte(){return idReporte;}
    public void setIdVenta(int pIdVenta){this.idReporte = pIdVenta;}

    public LocalDate getFechaGeneracion(){return fechaGeneracion;}

    public String getTipoReporte(){return tipoReporte;}
    public void setTipoReporte(String pTipoReporte){this.tipoReporte = pTipoReporte;}
 
    public Usuario getUsuario(){return usuario;}
    public void setUsuario(Usuario pUsuario){this.usuario = pUsuario;}
    //endregion
}
