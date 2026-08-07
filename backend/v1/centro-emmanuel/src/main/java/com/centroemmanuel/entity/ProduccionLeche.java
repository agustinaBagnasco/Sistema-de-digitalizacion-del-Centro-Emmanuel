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

    @Column(nullable = false)
    private double litros;

    @Column(length = 100)
    private String destino;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(length = 500)
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    public ProduccionLeche() {
    }

    public ProduccionLeche(Integer idProduccionLeche,
                           double litros,
                           String destino,
                           String observaciones,
                           Usuario usuario) {

        this.idProduccionLeche = idProduccionLeche;
        this.litros = litros;
        this.destino = destino;
        this.observaciones = observaciones;
        this.usuario = usuario;
        this.fecha = LocalDate.now();
    }

    // Getters y Setters

    public Integer getIdProduccionLeche() {
        return idProduccionLeche;
    }

    public void setIdProduccionLeche(Integer idProduccionLeche) {
        this.idProduccionLeche = idProduccionLeche;
    }

    public double getLitros() {
        return litros;
    }

    public void setLitros(double litros) {
        this.litros = litros;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}