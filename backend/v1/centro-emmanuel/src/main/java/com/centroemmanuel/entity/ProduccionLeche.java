package com.centroemmanuel.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "produccion_leche")
public class ProduccionLeche {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produccion_leche")
    private Integer idProduccionLeche;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "litros_terneros", nullable = false, precision = 15, scale = 3)
    private BigDecimal litrosTerneros;

    @Column(name = "venta_directa", nullable = false, precision = 15, scale = 3)
    private BigDecimal ventaDirecta;

    @Column(name = "consumo_cocina", nullable = false, precision = 15, scale = 3)
    private BigDecimal consumoCocina;

    @Column(name = "elaboracion_quesos", nullable = false, precision = 15, scale = 3)
    private BigDecimal elaboracionQuesos;

    @Column(name = "elaboracion_dulce_de_leche", nullable = false, precision = 15, scale = 3)
    private BigDecimal elaboracionDulceDeLeche;

    @Column(name = "elaboracion_quark", nullable = false, precision = 15, scale = 3)
    private BigDecimal elaboracionQuark;

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

    public BigDecimal getLitrosTerneros() {
        return litrosTerneros;
    }

    public void setLitrosTerneros(BigDecimal litrosTerneros) {
        this.litrosTerneros = litrosTerneros;
    }

    public BigDecimal getVentaDirecta() {
        return ventaDirecta;
    }

    public void setVentaDirecta(BigDecimal ventaDirecta) {
        this.ventaDirecta = ventaDirecta;
    }

    public BigDecimal getConsumoCocina() {
        return consumoCocina;
    }

    public void setConsumoCocina(BigDecimal consumoCocina) {
        this.consumoCocina = consumoCocina;
    }

    public BigDecimal getElaboracionQuesos() {
        return elaboracionQuesos;
    }

    public void setElaboracionQuesos(BigDecimal elaboracionQuesos) {
        this.elaboracionQuesos = elaboracionQuesos;
    }

    public BigDecimal getElaboracionDulceDeLeche() {
        return elaboracionDulceDeLeche;
    }

    public void setElaboracionDulceDeLeche(BigDecimal elaboracionDulceDeLeche) {
        this.elaboracionDulceDeLeche = elaboracionDulceDeLeche;
    }

    public BigDecimal getElaboracionQuark() {
        return elaboracionQuark;
    }

    public void setElaboracionQuark(BigDecimal elaboracionQuark) {
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

