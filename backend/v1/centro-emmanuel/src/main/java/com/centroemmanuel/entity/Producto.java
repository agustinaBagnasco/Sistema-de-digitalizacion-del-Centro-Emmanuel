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

    @Column(name = "peso_horma", precision = 15, scale = 3)
    private BigDecimal pesoHorma;

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

    //region Getters y Setters
    public Integer getIdProducto(){return idProducto;}
    public void setIdProducto(Integer pIdProducto){this.idProducto = pIdProducto;}

    public String getNombreProducto(){return nombreProducto;}
    public void setNombreProducto(String pNombreProducto){this.nombreProducto = pNombreProducto;}

    public String getDescripcion(){return descripcion;}
    public void setDescripcion(String pDescripcion){this.descripcion = pDescripcion;}

    public BigDecimal getStockActual(){return stockActual;}
    public void setStockActual(BigDecimal pStockActual){this.stockActual = pStockActual;}

    public BigDecimal getStockMinimo(){return stockMinimo;}
    public void setStockMinimo(BigDecimal pStockMinimo){this.stockMinimo = pStockMinimo;}

    public BigDecimal getCosto(){return costo;}
    public void setCosto(BigDecimal pCosto){this.costo = pCosto;}

    public BigDecimal getPesoHorma(){return pesoHorma;}
    public void setPesoHorma(BigDecimal pPesoHorma){this.pesoHorma = pPesoHorma;}

    public boolean isActivo(){return activo;}
    public void setActivo(boolean pActivo){this.activo = pActivo;}

    public Tipo getTipo(){return tipo;}
    public void setTipo(Tipo pTipo){this.tipo = pTipo;}

    public Categoria getCategoria(){return categoria;}
    public void setCategoria(Categoria pCategoria){this.categoria = pCategoria;}

    public UnidadMedida getUnidadMedida(){return unidadMedida;}
    public void setUnidadMedida(UnidadMedida pUnidadMedida){this.unidadMedida = pUnidadMedida;}

    public Producto getProductoResultado(){return productoResultado;}
    public void setProductoResultado(Producto pProductoResultado){this.productoResultado = pProductoResultado;}
    //endregion
}
