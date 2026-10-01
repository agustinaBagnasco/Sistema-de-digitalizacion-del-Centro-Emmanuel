package com.centroemmanuel.entity;

import com.centroemmanuel.enums.Tipo;
import com.centroemmanuel.enums.Categoria;
import com.centroemmanuel.enums.UnidadMedida;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;

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

    @Column(name = "stock_actual", precision = 15, scale = 3)
    private BigDecimal stockActual;

    @Column(name = "stock_minimo", precision = 15, scale = 3)
    private BigDecimal stockMinimo;

    @Column(name = "costo", precision = 15, scale = 3)
    private BigDecimal costo;

    @Column(name = "activo")
    private boolean activo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private Tipo tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria", nullable = true)
    private Categoria categoria;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_medida", nullable = false)
    private UnidadMedida unidadMedida;

    // Producto que se obtiene al procesar este insumo 
    @ManyToOne 
    @JoinColumn(name = "id_producto_resultado") 
    @JsonIgnoreProperties("productoResultado")
    private Producto productoResultado;

    public Producto() {
    }
    //INSUMOS
    public Producto(int pIdProducto, String pNombreProducto, String pDescripcion, BigDecimal pStockActual,
                    BigDecimal pStockMinimo, boolean pActivo, Tipo pTipo,
                    UnidadMedida pUnidadMedida) {
        this.idProducto = pIdProducto;
        this.nombreProducto = pNombreProducto;
        this.descripcion = pDescripcion;
        this.stockActual = pStockActual;
        this.stockMinimo = pStockMinimo;
        this.activo = pActivo;
        this.tipo = pTipo;
        this.unidadMedida = pUnidadMedida;
    }
    //PRODUCTOS
    public Producto(int pIdProducto, String pNombreProducto, String pDescripcion, BigDecimal pStockActual,
                    BigDecimal pStockMinimo, BigDecimal pCosto, boolean pActivo, Categoria pCategoria,
                    Tipo pTipo, UnidadMedida pUnidadMedida){
        this.idProducto = pIdProducto;
        this.nombreProducto = pNombreProducto;
        this.descripcion = pDescripcion;
        this.stockActual = pStockActual;
        this.stockMinimo = pStockMinimo;
        this.costo = pCosto;
        this.activo = pActivo;
        this.categoria = pCategoria;
        this.tipo = pTipo;
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

public BigDecimal getStockActual() {
    return stockActual;
}

public void setStockActual(BigDecimal stockActual) {
    this.stockActual = stockActual;
}

public BigDecimal getStockMinimo() {
    return stockMinimo;
}

public void setStockMinimo(BigDecimal stockMinimo) {
    this.stockMinimo = stockMinimo;
}

public BigDecimal getCosto() {
    return costo;
}

public void setCosto(BigDecimal costo) {
    this.costo = costo;
}
public boolean isActivo() {
    return activo;
}

public void setActivo(boolean activo) {
    this.activo = activo;
}
public Tipo getTipo() {
    return tipo;
}
public void setTipo(Tipo tipo) {
    this.tipo = tipo;
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

public Producto getProductoResultado() { 
    return productoResultado; 
    } 
public void setProductoResultado(Producto productoResultado) {
     this.productoResultado = productoResultado; 
     }
}