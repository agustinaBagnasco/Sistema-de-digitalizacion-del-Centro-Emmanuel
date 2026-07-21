package com.centroemmanuel.entity;

import java.time.LocalDate;

public class ProduccionLeche {
    private int idProduccionLeche;
    private double litros;
    private String destino;
    private LocalDate fecha;
    private String observaciones;
    private Usuario usuario;

    public ProduccionLeche(){}

    public ProduccionLeche(int pIdProduccionLeche, double pLitros, String pDestino, String pObservaciones, Usuario pUsuario){
        this.idProduccionLeche = pIdProduccionLeche;
        this.litros = pLitros;
        this.destino = pDestino;
        this.observaciones = pObservaciones;
        this.usuario = pUsuario;
        this.fecha = LocalDate.now();
    }

    //region Getters y Setters
    public int getIdProduccionLeche(){return idProduccionLeche;}
    public void setIdProduccionLeche(int pIdProduccionLeche){this.idProduccionLeche = pIdProduccionLeche;}

    public double getLitros(){return litros;}
    public void setLitros(double pLitros){this.litros = pLitros;}

    public String getDestino(){return destino;}
    public void setDestino(String pDestino){this.destino = pDestino;}

    public String getObservaciones(){return observaciones;}
    public void setObservaciones(String pObservaciones){this.observaciones = pObservaciones;}

    public Usuario getUsuario(){return usuario;}
    public void setUsuario(Usuario pUsuario){this.usuario = pUsuario;}

    public LocalDate getFecha(){return fecha;}
    //endregion
}
