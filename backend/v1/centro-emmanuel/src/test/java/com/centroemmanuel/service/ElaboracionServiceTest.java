package com.centroemmanuel.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import com.centroemmanuel.entity.Elaboracion;
import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.enums.Categoria;

class ElaboracionServiceTest {
    @Test
    void quesoSinPesoDeHormaConservaLaCantidadEnKilos() {
        Elaboracion elaboracion = new Elaboracion();
        elaboracion.setCantidadProducida(new BigDecimal("2.75"));
        elaboracion.setCantidadHormas(3);
        Producto queso = new Producto();
        queso.setCategoria(Categoria.QUESO);
        queso.setPesoHorma(BigDecimal.ZERO);

        ElaboracionService.normalizarCantidadQueso(elaboracion, queso);

        assertEquals(new BigDecimal("2.75"), elaboracion.getCantidadProducida());
        assertNull(elaboracion.getCantidadHormas());
    }

    @Test
    void pesoDeHormaConfiguradoConvierteCantidadDeHormasAKilos() {
        Elaboracion elaboracion = new Elaboracion();
        elaboracion.setCantidadProducida(new BigDecimal("2"));
        elaboracion.setCantidadHormas(2);
        Producto queso = new Producto();
        queso.setCategoria(Categoria.QUESO);
        queso.setPesoHorma(new BigDecimal("2.5"));

        ElaboracionService.normalizarCantidadQueso(elaboracion, queso);

        assertEquals(new BigDecimal("5.0"), elaboracion.getCantidadProducida());
        assertEquals(2, elaboracion.getCantidadHormas());
    }

    @Test
    void convierteHormasDeDamboAKilos() {
        assertEquals(new BigDecimal("6.6"),
                ElaboracionService.convertirHormasAKilos(2, new BigDecimal("3.3")));
    }

    @Test
    void convierteHormasDeSardoAKilos() {
        assertEquals(new BigDecimal("4"),
                ElaboracionService.convertirHormasAKilos(2, new BigDecimal("2")));
    }

    @Test
    void convierteHormasDeSemiduroAKilos() {
        assertEquals(new BigDecimal("16"),
                ElaboracionService.convertirHormasAKilos(2, new BigDecimal("8")));
    }

    @Test
    void rechazaQuesosSinPesoConfiguradoEnElProducto() {
        Elaboracion elaboracion = new Elaboracion();
        elaboracion.setCantidadProducida(BigDecimal.ONE);
        elaboracion.setCantidadHormas(1);
        Producto queso = new Producto();
        queso.setNombreProducto("Queso Dambo");
        queso.setCategoria(Categoria.QUESO);

        assertThrows(IllegalArgumentException.class,
                () -> ElaboracionService.normalizarCantidadQueso(elaboracion, queso));
    }

    @Test
    void rechazaUnPesoDeHormaCeroParaLaConversion() {
        assertThrows(IllegalArgumentException.class,
                () -> ElaboracionService.convertirHormasAKilos(1, BigDecimal.ZERO));
    }
}
