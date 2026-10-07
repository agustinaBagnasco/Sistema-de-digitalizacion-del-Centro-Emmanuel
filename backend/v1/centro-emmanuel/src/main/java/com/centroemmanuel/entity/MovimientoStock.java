package com.centroemmanuel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "movimiento_stock")
public class MovimientoStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mov_stock")
    private Integer idMovStock;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto productoMov;

    @Column(name = "cantidad_mov", nullable = false, precision = 15, scale = 3)
    private BigDecimal cantidadMov;

    @Column(name = "tipo_mov", length = 20, nullable = false)
    private String tipoMov;

    @Column(name = "fecha_mov", nullable = false)
    private LocalDateTime fechaMov;

    @Column(name = "motivo_mov", length = 1000)
    private String motivoMov;

    @Column(name = "destino_leche", length = 32)
    private String destinoLeche;

    @Column(name = "consumo_leche_automatico", nullable = false)
    private boolean consumoLecheAutomatico;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    public MovimientoStock() {
        this.fechaMov = LocalDateTime.now();
    }

    public MovimientoStock(Integer idMovStock,
                           Producto productoMov,
                           BigDecimal cantidadMov,
                           String tipoMov,
                           String motivoMov,
                           Usuario usuario) {

        this.idMovStock = idMovStock;
        this.productoMov = productoMov;
        this.cantidadMov = cantidadMov;
        this.tipoMov = tipoMov; // Corregido
        this.fechaMov = LocalDateTime.now();
        this.motivoMov = motivoMov;
        this.usuario = usuario;
    }

    //region Getters y Setters
    public Integer getIdMovStock(){return idMovStock;}
    public void setIdMovStock(Integer pIdMovStock){this.idMovStock = pIdMovStock;}

    public Producto getProductoMov(){return productoMov;}
    public void setProductoMov(Producto pProductoMov){this.productoMov = pProductoMov;}

    public BigDecimal getCantidadMov(){return cantidadMov;}
    public void setCantidadMov(BigDecimal pCantidadMov){this.cantidadMov = pCantidadMov;}

    public String getTipoMov(){return tipoMov;}
    public void setTipoMov(String pTipoMov){this.tipoMov = pTipoMov;}

    public LocalDateTime getFechaMov(){return fechaMov;}

    public String getMotivoMov(){return motivoMov;}
    public void setMotivoMov(String pMotivoMov){this.motivoMov = pMotivoMov;}

    public String getDestinoLeche(){return destinoLeche;}
    public void setDestinoLeche(String pDestinoLeche){this.destinoLeche = pDestinoLeche;}

    public boolean isConsumoLecheAutomatico(){return consumoLecheAutomatico;}
    public void setConsumoLecheAutomatico(boolean pConsumoLecheAutomatico){this.consumoLecheAutomatico = pConsumoLecheAutomatico;}

    public Usuario getUsuario(){return usuario;}
    public void setUsuario(Usuario pUsuario){this.usuario = pUsuario;}
    //endregion
}
