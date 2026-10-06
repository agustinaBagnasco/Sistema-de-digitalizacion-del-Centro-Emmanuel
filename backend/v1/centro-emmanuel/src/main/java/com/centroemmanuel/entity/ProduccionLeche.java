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

    @Column(name = "litros_totales", precision = 15, scale = 3)
    private BigDecimal litrosTotales;

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

    //region Getters y Setters
    public Integer getIdProduccionLeche(){return idProduccionLeche;}
    public void setIdProduccionLeche(Integer pIdProduccionLeche){this.idProduccionLeche = pIdProduccionLeche;}

    public LocalDate getFecha(){return fecha;}
    public void setFecha(LocalDate pFecha){this.fecha = pFecha;}

    public BigDecimal getLitrosTotales(){return litrosTotales;}
    public void setLitrosTotales(BigDecimal pLitrosTotales){this.litrosTotales = pLitrosTotales;}

    public BigDecimal getLitrosTerneros(){return litrosTerneros;}
    public void setLitrosTerneros(BigDecimal pLitrosTerneros){this.litrosTerneros = pLitrosTerneros;}

    public BigDecimal getVentaDirecta(){return ventaDirecta;}
    public void setVentaDirecta(BigDecimal pVentaDirecta){this.ventaDirecta = pVentaDirecta;}

    public BigDecimal getConsumoCocina(){return consumoCocina;}
    public void setConsumoCocina(BigDecimal pConsumoCocina){this.consumoCocina = pConsumoCocina;}

    public BigDecimal getElaboracionQuesos(){return elaboracionQuesos;}
    public void setElaboracionQuesos(BigDecimal pElaboracionQuesos){this.elaboracionQuesos = pElaboracionQuesos;}

    public BigDecimal getElaboracionDulceDeLeche(){return elaboracionDulceDeLeche;}
    public void setElaboracionDulceDeLeche(BigDecimal pElaboracionDulceDeLeche){this.elaboracionDulceDeLeche = pElaboracionDulceDeLeche;}

    public BigDecimal getElaboracionQuark(){return elaboracionQuark;}
    public void setElaboracionQuark(BigDecimal pElaboracionQuark){this.elaboracionQuark = pElaboracionQuark;}

    public String getComentario(){return comentario;}
    public void setComentario(String pComentario){this.comentario = pComentario;}

    public Usuario getUsuario(){return usuario;}
    public void setUsuario(Usuario pUsuario){this.usuario = pUsuario;}
    //endregion
}
