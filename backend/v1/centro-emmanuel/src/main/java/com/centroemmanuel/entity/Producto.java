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
}