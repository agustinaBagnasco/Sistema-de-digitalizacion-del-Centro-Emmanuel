package com.centroemmanuel.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "venta")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venta")
    private Integer idVenta;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "fecha_venta", nullable = false)
    private LocalDate fechaVenta;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @OneToMany(
            mappedBy = "venta",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<DetalleVenta> detalles = new ArrayList<>();

    public Venta() {
    }

    public Venta(Integer idVenta,
                 BigDecimal total,
                 Usuario usuario,
                 List<DetalleVenta> detalles) {

        this.idVenta = idVenta;
        this.total = total;
        this.fechaVenta = LocalDate.now();
        this.usuario = usuario;
        this.detalles = detalles;
    }

    public void registrarVenta() {
    }

    // Getters y Setters

    public Integer getIdVenta() {
        return idVenta;
    }

    public void setIdVenta(Integer idVenta) {
        this.idVenta = idVenta;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public LocalDate getFechaVenta() {
        return fechaVenta;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<DetalleVenta> getDetalleVenta() {
        return detalles;
    }

    public void setDetalleVenta(List<DetalleVenta> detalles) {
        this.detalles = detalles;
    }
}