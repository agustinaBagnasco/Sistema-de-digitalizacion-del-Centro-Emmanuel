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

    @ManyToOne
    @JoinColumn(name = "id_elaboracion", nullable = false)
    @JsonIgnore
    private Elaboracion elaboracion;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto insumoUtilizado;

    @Column(name = "cantidad_utilizada", nullable = false, precision = 15, scale = 3)
    private BigDecimal cantidadUtilizada;

    @Column(name = "costo_unitario", precision = 15, scale = 3)
    private BigDecimal costoUnitario;

    public DetalleElaboracion() {
    }

    //region Getters y Setters
    public Integer getIdDetalleElaboracion(){return idDetalleElaboracion;}
    public void setIdDetalleElaboracion(Integer pIdDetalleElaboracion){this.idDetalleElaboracion = pIdDetalleElaboracion;}

    public Elaboracion getElaboracion(){return elaboracion;}
    public void setElaboracion(Elaboracion pElaboracion){this.elaboracion = pElaboracion;}

    public Producto getInsumoUtilizado(){return insumoUtilizado;}
    public void setInsumoUtilizado(Producto pInsumoUtilizado){this.insumoUtilizado = pInsumoUtilizado;}

    public BigDecimal getCantidadUtilizada(){return cantidadUtilizada;}
    public void setCantidadUtilizada(BigDecimal pCantidadUtilizada){this.cantidadUtilizada = pCantidadUtilizada;}

    public BigDecimal getCostoUnitario(){return costoUnitario;}
    public void setCostoUnitario(BigDecimal pCostoUnitario){this.costoUnitario = pCostoUnitario;}
    //endregion
}
