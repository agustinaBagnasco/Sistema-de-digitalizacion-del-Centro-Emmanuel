package com.centroemmanuel.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "detalle_elaboracion")
public class DetalleElaboracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_elaboracion")
    private Integer idDetalleElaboracion;

    // Elaboración a la que pertenece este detalle
    @ManyToOne
    @JoinColumn(name = "id_elaboracion", nullable = false)
    @JsonIgnore
    private Elaboracion elaboracion;

    // Producto utilizado como insumo
    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto insumoUtilizado;

    // Cantidad utilizada del insumo
    @Column(name = "cantidad_utilizada", nullable = false)
    private Double cantidadUtilizada;

    // Costo del insumo al momento de la elaboración
    @Column(name = "costo_unitario", precision = 10, scale = 2)
    private BigDecimal costoUnitario;


    // =========================
    // CONSTRUCTORES
    // =========================

    public DetalleElaboracion() {
    }


    // =========================
    // GETTERS Y SETTERS
    // =========================

    public Integer getIdDetalleElaboracion() {
        return idDetalleElaboracion;
    }

    public void setIdDetalleElaboracion(Integer idDetalleElaboracion) {
        this.idDetalleElaboracion = idDetalleElaboracion;
    }

    public Elaboracion getElaboracion() {
        return elaboracion;
    }

    public void setElaboracion(Elaboracion elaboracion) {
        this.elaboracion = elaboracion;
    }

    public Producto getInsumoUtilizado() {
        return insumoUtilizado;
    }

    public void setInsumoUtilizado(Producto insumoUtilizado) {
        this.insumoUtilizado = insumoUtilizado;
    }

    public Double getCantidadUtilizada() {
        return cantidadUtilizada;
    }

    public void setCantidadUtilizada(Double cantidadUtilizada) {
        this.cantidadUtilizada = cantidadUtilizada;
    }

    public BigDecimal getCostoUnitario() {
        return costoUnitario;
    }

    public void setCostoUnitario(BigDecimal costoUnitario) {
        this.costoUnitario = costoUnitario;
    }
}