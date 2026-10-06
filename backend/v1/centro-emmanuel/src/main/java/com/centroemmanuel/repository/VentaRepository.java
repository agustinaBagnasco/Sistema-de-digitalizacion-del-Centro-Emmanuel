package com.centroemmanuel.repository;

import com.centroemmanuel.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {
    @Query("""
            SELECT DISTINCT venta
            FROM Venta venta
            LEFT JOIN FETCH venta.detalles detalle
            LEFT JOIN FETCH detalle.productoVendido
            LEFT JOIN FETCH venta.usuario
            ORDER BY venta.fechaVenta, venta.idVenta
            """)
    List<Venta> findAllWithDetails();

    @Query("""
            SELECT DISTINCT venta
            FROM Venta venta
            LEFT JOIN FETCH venta.detalles detalle
            LEFT JOIN FETCH detalle.productoVendido
            LEFT JOIN FETCH venta.usuario
            WHERE venta.fechaVenta >= :desde AND venta.fechaVenta < :hasta
            ORDER BY venta.fechaVenta, venta.idVenta
            """)
    List<Venta> findWithDetailsForPeriod(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);
}
