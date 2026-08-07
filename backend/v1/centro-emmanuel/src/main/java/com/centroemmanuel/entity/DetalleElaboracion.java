package com.centroemmanuel.entity;

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
    @JoinColumn(name = "id_elaboracion")
    private Elaboracion elaboracion;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto insumoUtilizado;

    @Column(name = "cantidad_utilizada")
    private double cantidadUtilizada;

    @Column(name = "costo_unitario", precision = 10, scale = 2)
    private BigDecimal costoUnitario;

    public DetalleElaboracion(){}

    public DetalleElaboracion(Integer idDetalleElaboracion,
                              Producto insumoUtilizado,
                              double cantidadUtilizada,
                              BigDecimal costoUnitario){
        this.idDetalleElaboracion = idDetalleElaboracion;
        this.insumoUtilizado = insumoUtilizado;
        this.cantidadUtilizada = cantidadUtilizada;
        this.costoUnitario = costoUnitario;
    }
    

    //region Getters y Setters
    public int getIdDetalleElaboracion(){return idDetalleElaboracion;}
    public void setIdDetalleElaboracion(int pIdDetalleElaboracion){this.idDetalleElaboracion = pIdDetalleElaboracion;}

    public Producto getInsumoUtilizado(){return insumoUtilizado;}
    public void setInsumoUtilizado(Producto pInsumoUtilizado){this.insumoUtilizado = pInsumoUtilizado;}

    public double getCantidadUtilizada(){return cantidadUtilizada;}
    public void setCantidadUtilizada(double pCantidadUtilizada){this.cantidadUtilizada = pCantidadUtilizada;}

    public BigDecimal getCostoUnitario(){return costoUnitario;}
    public void setCostoUnitario(BigDecimal pCostoUnitario){this.costoUnitario = pCostoUnitario;}
    //endregion
}
