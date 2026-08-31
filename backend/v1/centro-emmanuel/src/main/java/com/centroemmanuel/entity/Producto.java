package com.centroemmanuel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer idProducto;

    @Column(name = "nombre_producto", nullable = false)
    private String nombreProducto;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "stock_actual")
    private Double stockActual;

    @Column(name = "stock_minimo")
    private Double stockMinimo;

    @Column(name = "activo")
    private boolean activo;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_unidad_medida")
    private UnidadMedida unidadMedida;

    public Producto() {
    }

    public Producto(Integer pIdProducto, String pNombreProducto, String pDescripcion,
                    Double pStockActual, Double pStockMinimo, boolean pActivo,
                    Categoria pCategoria, UnidadMedida pUnidadMedida) {
        this.idProducto = pIdProducto;
        this.nombreProducto = pNombreProducto;
        this.descripcion = pDescripcion;
        this.stockActual = pStockActual;
        this.stockMinimo = pStockMinimo;
        this.activo = pActivo;
        this.categoria = pCategoria;
        this.unidadMedida = pUnidadMedida;
    }

    // Getters y Setters

    public Integer getIdProducto() {
    return idProducto;
}

public void setIdProducto(Integer idProducto) {
    this.idProducto = idProducto;
}

public String getNombreProducto() {
    return nombreProducto;
}

public void setNombreProducto(String nombreProducto) {
    this.nombreProducto = nombreProducto;
}

public String getDescripcion() {
    return descripcion;
}

public void setDescripcion(String descripcion) {
    this.descripcion = descripcion;
}

public Double getStockActual() {
    return stockActual;
}

public void setStockActual(Double stockActual) {
    this.stockActual = stockActual;
}

public Double getStockMinimo() {
    return stockMinimo;
}

public void setStockMinimo(Double stockMinimo) {
    this.stockMinimo = stockMinimo;
}

public boolean isActivo() {
    return activo;
}

public void setActivo(boolean activo) {
    this.activo = activo;
}

public Categoria getCategoria() {
    return categoria;
}

public void setCategoria(Categoria categoria) {
    this.categoria = categoria;
}

public UnidadMedida getUnidadMedida() {
    return unidadMedida;
}

public void setUnidadMedida(UnidadMedida unidadMedida) {
    this.unidadMedida = unidadMedida;
}
}