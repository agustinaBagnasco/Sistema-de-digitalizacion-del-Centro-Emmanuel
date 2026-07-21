package com.centroemmanuel.entity;

public class Producto {
    private int idProducto;
    private String nombreProducto;
    private String descripcion;
    private Double stockActual;
    private Double stockMinimo;
    private boolean activo;
    private Categoria categoria;
    private UnidadMedida unidadMedida;

    public Producto(){}

    public Producto(int pIdProducto, String pNombreProducto, String pDescripcion, Double pStockActual, Double pStockMinimo, boolean pActivo, Categoria pCategoria, UnidadMedida pUnidadMedida){
        this.idProducto = pIdProducto;
        this.nombreProducto = pNombreProducto;
        this.descripcion = pDescripcion;
        this.stockActual = pStockActual;
        this.stockMinimo = pStockMinimo;
        this.activo = pActivo;
        this.categoria = pCategoria;
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

    public UnidadMedida getUnidadMedida(){return unidadMedida;}
    public void setUnidadMedida(UnidadMedida pUnidadMedida){this.unidadMedida = pUnidadMedida;}
    //endregion
}
