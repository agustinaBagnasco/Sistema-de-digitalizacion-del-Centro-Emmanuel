package com.centroemmanuel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "unidad_medida")
public class UnidadMedida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unidad_medida")
    private Integer idUnidadMedida;

    @Column(name = "nombre_um", nullable = false)
    private String nombreUM;

    @Column(name = "abreviatura", nullable = false)
    private String abreviatura;

    public UnidadMedida() {
    }

    public UnidadMedida(Integer pIdUnidadMedida, String pNombreUM, String pAbreviatura) {
        this.idUnidadMedida = pIdUnidadMedida;
        this.nombreUM = pNombreUM;
        this.abreviatura = pAbreviatura;
    }

    // Getters y Setters
    public Integer getIdUnidadMedida() {
        return idUnidadMedida;
    }

    public void setIdUnidadMedida(Integer pIdUnidadMedida) {
        this.idUnidadMedida = pIdUnidadMedida;
    }

    public String getNombreUM() {
        return nombreUM;
    }

    public void setNombreUM(String pNombreUM) {
        this.nombreUM = pNombreUM;
    }

    public String getAbreviatura() {
        return abreviatura;
    }

    public void setAbreviatura(String pAbreviatura) {
        this.abreviatura = pAbreviatura;
    }
}