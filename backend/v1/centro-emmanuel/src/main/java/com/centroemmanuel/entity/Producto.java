package com.centroemmanuel.entity;

import com.centroemmanuel.enums.Tipo;
import com.centroemmanuel.enums.UnidadMedida;

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
    private Tipo tipo;

    @ManyToOne
    @JoinColumn(name = "id_unidad_medida")
    private UnidadMedida unidadMedida;

    public Producto() {
    }

    public Producto(int pIdProducto, String pNombreProducto, String pDescripcion, Double pStockActual, Double pStockMinimo, boolean pActivo, Categoria pCategoria, Tipo pTipo, UnidadMedida pUnidadMedida){
        this.idProducto = pIdProducto;
        this.nombreProducto = pNombreProducto;
        this.descripcion = pDescripcion;
        this.stockActual = pStockActual;
        this.stockMinimo = pStockMinimo;
        this.activo = pActivo;
        this.categoria = pCategoria;
        this.tipo = pTipo;
        this.unidadMedida = pUnidadMedida;
    }

    //region Getters y Setters
    public int getIdProducto(){return idProducto;}
    public void setIdProducto(int pIdProducto){this.idProducto = pIdProducto;}

    public String getNombreProducto(){return nombreProducto;}
    public void setNombreProducto(String pNombreProducto){this.nombreProducto = pNombreProducto;}

    public String getDescripcionProducto(){return descripcion;}
    public void setDescripcionProducto(String pDescripcion){this.descripcion = pDescripcion;}

    public Double getStockActual(){return stockActual;}
    public void setStockActual(Double pStockActual){this.stockActual = pStockActual;}

    public Double getStockMinimo(){return stockMinimo;}
    public void setStockMinimo(Double pStockMinimo){this.stockMinimo = pStockMinimo;}

    public boolean isActivo(){return activo;}
    public void setActivo(boolean pActivo){this.activo = pActivo;}

    public Categoria getCategoria(){return categoria;}
    public void setCategoria(Categoria pCategoria){this.categoria = pCategoria;}

    public Tipo getTipo(){return tipo;}
    public void setTipo(Tipo pTipo){this.tipo = pTipo;}

    public UnidadMedida getUnidadMedida(){return unidadMedida;}
    public void setUnidadMedida(UnidadMedida pUnidadMedida){this.unidadMedida = pUnidadMedida;}
    //endregion
}
