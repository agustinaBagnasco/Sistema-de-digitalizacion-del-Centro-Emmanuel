package com.centroemmanuel.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "produccion_leche")
public class ProduccionLeche {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produccion_leche")
    private Integer idProduccionLeche;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "litros_terneros", nullable = false)
    private double litrosTerneros;

    @Column(name = "venta_directa", nullable = false)
    private double ventaDirecta;

    @Column(name = "consumo_cocina", nullable = false)
    private double consumoCocina;

    @Column(name = "elaboracion_quesos", nullable = false)
    private double elaboracionQuesos;

    @Column(name = "elaboracion_dulce_de_leche", nullable = false)
    private double elaboracionDulceDeLeche;

    @Column(name = "elaboracion_quark", nullable = false)
    private double elaboracionQuark;

    @Column(length = 500)
    private String comentario;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    public ProduccionLeche() {
    }

    public Integer getIdProduccionLeche() {
        return idProduccionLeche;
    }

    public void setIdProduccionLeche(Integer idProduccionLeche) {
        this.idProduccionLeche = idProduccionLeche;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public double getLitrosTerneros() {
        return litrosTerneros;
    }

    public void setLitrosTerneros(double litrosTerneros) {
        this.litrosTerneros = litrosTerneros;
    }

    public double getVentaDirecta() {
        return ventaDirecta;
    }

    public void setVentaDirecta(double ventaDirecta) {
        this.ventaDirecta = ventaDirecta;
    }

    public double getConsumoCocina() {
        return consumoCocina;
    }

    public void setConsumoCocina(double consumoCocina) {
        this.consumoCocina = consumoCocina;
    }

    public double getElaboracionQuesos() {
        return elaboracionQuesos;
    }

    public void setElaboracionQuesos(double elaboracionQuesos) {
        this.elaboracionQuesos = elaboracionQuesos;
    }

    public double getElaboracionDulceDeLeche() {
        return elaboracionDulceDeLeche;
    }

    public void setElaboracionDulceDeLeche(double elaboracionDulceDeLeche) {
        this.elaboracionDulceDeLeche = elaboracionDulceDeLeche;
    }

    public double getElaboracionQuark() {
        return elaboracionQuark;
    }

    public void setElaboracionQuark(double elaboracionQuark) {
        this.elaboracionQuark = elaboracionQuark;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}

