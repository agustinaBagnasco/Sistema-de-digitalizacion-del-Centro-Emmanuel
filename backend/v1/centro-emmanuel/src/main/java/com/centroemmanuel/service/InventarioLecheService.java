package com.centroemmanuel.service;

import com.centroemmanuel.dto.InventarioLeche;
import com.centroemmanuel.dto.InventarioLecheResponse;
import com.centroemmanuel.entity.DetalleElaboracion;
import com.centroemmanuel.entity.DetalleVenta;
import com.centroemmanuel.entity.Elaboracion;
import com.centroemmanuel.entity.MovimientoStock;
import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.entity.ProduccionLeche;
import com.centroemmanuel.entity.Venta;
import com.centroemmanuel.enums.Categoria;
import com.centroemmanuel.enums.DestinoLeche;
import com.centroemmanuel.repository.ElaboracionRepository;
import com.centroemmanuel.repository.MovimientoStockRepository;
import com.centroemmanuel.repository.ProduccionLecheRepository;
import com.centroemmanuel.repository.ProductoRepository;
import com.centroemmanuel.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class InventarioLecheService {
    private final ProduccionLecheRepository produccionLecheRepository;
    private final ElaboracionRepository elaboracionRepository;
    private final MovimientoStockRepository movimientoStockRepository;
    private final VentaRepository ventaRepository;

    public InventarioLecheService(
            ProduccionLecheRepository produccionLecheRepository,
            ElaboracionRepository elaboracionRepository,
            MovimientoStockRepository movimientoStockRepository,
            VentaRepository ventaRepository) {
        this.produccionLecheRepository = produccionLecheRepository;
        this.elaboracionRepository = elaboracionRepository;
        this.movimientoStockRepository = movimientoStockRepository;
        this.ventaRepository = ventaRepository;
    }

    @Transactional(readOnly = true)
    public InventarioLecheResponse obtenerResumen() {
        return obtenerResumen(null, null);
    }

    @Transactional(readOnly = true)
    public InventarioLecheResponse obtenerResumen(LocalDate desde, LocalDate hasta) {
        return resumir(desde, hasta, null);
    }

    @Transactional(readOnly = true)
    public void validarUso(DestinoLeche destino, BigDecimal cantidad) {
        validarUso(destino, cantidad, null);
    }

    @Transactional(readOnly = true)
    public void validarUso(DestinoLeche destino, BigDecimal cantidad, Integer elaboracionExcluida) {
        if (destino == null || cantidad == null || cantidad.signum() <= 0) {
            throw new IllegalArgumentException("El destino y una cantidad positiva de leche son obligatorios.");
        }
        InventarioLeche area = resumir(null, null, elaboracionExcluida).areas().stream()
                .filter(item -> item.destino().equals(destino.name()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el destino de leche."));
        if (area.disponible().compareTo(cantidad) < 0) {
            throw new IllegalArgumentException(
                    "No hay suficientes litros disponibles para " + destino.getEtiqueta()
                            + ". Disponibles: " + area.disponible().stripTrailingZeros().toPlainString() + " L.");
        }
    }

    @Transactional(readOnly = true)
    public void validarAsignaciones(ProduccionLeche nueva, Integer registroExcluido) {
        BigDecimal total = cero(nueva.getLitrosTotales());
        BigDecimal asignado = totalAsignado(nueva);
        if (total.signum() < 0 || asignado.compareTo(total) > 0) {
            throw new IllegalArgumentException(
                    "Las asignaciones por destino no pueden superar los litros totales producidos.");
        }
        if (nueva.getFecha() == null) {
            throw new IllegalArgumentException("La fecha de producción es obligatoria.");
        }

        Map<DestinoLeche, BigDecimal> usos = usosActuales(null, null, null);
        EnumMap<DestinoLeche, BigDecimal> asignaciones = asignacionesActuales(registroExcluido);
        sumarAsignaciones(asignaciones, nueva);
        for (DestinoLeche destino : DestinoLeche.values()) {
            BigDecimal disponible = asignaciones.get(destino).subtract(usos.get(destino));
            if (disponible.signum() < 0) {
                throw new IllegalArgumentException(
                        "No se puede reducir la asignación de " + destino.getEtiqueta()
                                + " por debajo de los litros ya utilizados ("
                                + usos.get(destino).stripTrailingZeros().toPlainString() + " L).");
            }
        }
    }

    public static DestinoLeche destinoDeElaboracion(Producto producto) {
        if (producto == null) {
            return null;
        }
        String nombre = normalizar(producto.getNombreProducto());
        if (nombre.contains("quark")) {
            return DestinoLeche.QUARK;
        }
        if (producto.getCategoria() == Categoria.QUESO) {
            return DestinoLeche.QUESO;
        }
        if (producto.getCategoria() == Categoria.DULCEDELECHE) {
            return DestinoLeche.DULCE_DE_LECHE;
        }
        return null;
    }

    private InventarioLecheResponse resumir(
            LocalDate desde,
            LocalDate hasta,
            Integer elaboracionExcluida) {
        EnumMap<DestinoLeche, BigDecimal> asignaciones = asignacionesActuales(null, desde, hasta);
        Map<DestinoLeche, BigDecimal> usos = usosActuales(desde, hasta, elaboracionExcluida);
        BigDecimal litrosTotales = produccionLecheRepository.findAll().stream()
                .filter(registro -> incluida(registro.getFecha(), desde, hasta))
                .map(registro -> registro.getLitrosTotales() == null
                        ? totalAsignado(registro) : registro.getLitrosTotales())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalAsignado = asignaciones.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalUtilizado = usos.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        List<InventarioLeche> areas = List.of(DestinoLeche.values()).stream()
                .map(destino -> {
                    BigDecimal asignado = asignaciones.get(destino);
                    BigDecimal utilizado = usos.get(destino);
                    return new InventarioLeche(
                            destino.name(),
                            destino.getEtiqueta(),
                            asignado,
                            utilizado,
                            asignado.subtract(utilizado));
                })
                .toList();
        return new InventarioLecheResponse(litrosTotales, totalAsignado, totalUtilizado, areas);
    }

    private EnumMap<DestinoLeche, BigDecimal> asignacionesActuales(Integer excluido) {
        return asignacionesActuales(excluido, null, null);
    }

    private EnumMap<DestinoLeche, BigDecimal> asignacionesActuales(
            Integer excluido,
            LocalDate desde,
            LocalDate hasta) {
        EnumMap<DestinoLeche, BigDecimal> asignaciones = mapaCeros();
        for (ProduccionLeche registro : produccionLecheRepository.findAll()) {
            if (!incluida(registro.getFecha(), desde, hasta)
                    || (excluido != null && excluido.equals(registro.getIdProduccionLeche()))) {
                continue;
            }
            sumarAsignaciones(asignaciones, registro);
        }
        return asignaciones;
    }

    private void sumarAsignaciones(Map<DestinoLeche, BigDecimal> asignaciones, ProduccionLeche registro) {
        asignaciones.merge(DestinoLeche.TERNEROS, cero(registro.getLitrosTerneros()), BigDecimal::add);
        asignaciones.merge(DestinoLeche.VENTA_DIRECTA, cero(registro.getVentaDirecta()), BigDecimal::add);
        asignaciones.merge(DestinoLeche.CONSUMO_COCINA, cero(registro.getConsumoCocina()), BigDecimal::add);
        asignaciones.merge(DestinoLeche.QUESO, cero(registro.getElaboracionQuesos()), BigDecimal::add);
        asignaciones.merge(DestinoLeche.DULCE_DE_LECHE, cero(registro.getElaboracionDulceDeLeche()), BigDecimal::add);
        asignaciones.merge(DestinoLeche.QUARK, cero(registro.getElaboracionQuark()), BigDecimal::add);
    }

    private Map<DestinoLeche, BigDecimal> usosActuales(
            LocalDate desde,
            LocalDate hasta,
            Integer elaboracionExcluida) {
        EnumMap<DestinoLeche, BigDecimal> usos = mapaCeros();

        for (Elaboracion elaboracion : elaboracionRepository.findAll()) {
            if (!incluida(elaboracion.getFechaElaboracion(), desde, hasta)
                    || (elaboracionExcluida != null
                    && elaboracionExcluida.equals(elaboracion.getIdElaboracion()))) {
                continue;
            }
            DestinoLeche destino = destinoDeElaboracion(elaboracion.getProductoElaborado());
            if (destino == null || elaboracion.getDetalles() == null) {
                continue;
            }
            for (DetalleElaboracion detalle : elaboracion.getDetalles()) {
                if (detalle.getInsumoUtilizado() != null
                        && detalle.getInsumoUtilizado().getCategoria() == Categoria.LECHE) {
                    usos.merge(destino, cero(detalle.getCantidadUtilizada()), BigDecimal::add);
                }
            }
        }

        for (Venta venta : ventaRepository.findAllWithDetails()) {
            if (!incluida(venta.getFechaVenta(), desde, hasta) || venta.getDetalleVenta() == null) {
                continue;
            }
            for (DetalleVenta detalle : venta.getDetalleVenta()) {
                if (detalle.getProductoVendido() != null
                        && detalle.getProductoVendido().getCategoria() == Categoria.LECHE) {
                    usos.merge(DestinoLeche.VENTA_DIRECTA, cero(detalle.getCantidadDV()), BigDecimal::add);
                }
            }
        }

        for (MovimientoStock movimiento : movimientoStockRepository.findAll()) {
            if (!"SALIDA".equalsIgnoreCase(movimiento.getTipoMov())
                    || movimiento.getDestinoLeche() == null
                    || movimiento.isConsumoLecheAutomatico()
                    || !incluida(movimiento.getFechaMov() == null
                            ? null : movimiento.getFechaMov().toLocalDate(), desde, hasta)) {
                continue;
            }
            DestinoLeche destino = destinoValido(movimiento.getDestinoLeche());
            if (destino != null) {
                usos.merge(destino, cero(movimiento.getCantidadMov()), BigDecimal::add);
            }
        }
        return usos;
    }

    private EnumMap<DestinoLeche, BigDecimal> mapaCeros() {
        EnumMap<DestinoLeche, BigDecimal> mapa = new EnumMap<>(DestinoLeche.class);
        for (DestinoLeche destino : DestinoLeche.values()) {
            mapa.put(destino, BigDecimal.ZERO);
        }
        return mapa;
    }

    private BigDecimal totalAsignado(ProduccionLeche registro) {
        return cero(registro.getLitrosTerneros())
                .add(cero(registro.getVentaDirecta()))
                .add(cero(registro.getConsumoCocina()))
                .add(cero(registro.getElaboracionQuesos()))
                .add(cero(registro.getElaboracionDulceDeLeche()))
                .add(cero(registro.getElaboracionQuark()));
    }

    private boolean incluida(LocalDate fecha, LocalDate desde, LocalDate hasta) {
        return fecha != null
                && (desde == null || !fecha.isBefore(desde))
                && (hasta == null || !fecha.isAfter(hasta));
    }

    private BigDecimal cero(BigDecimal valor) {
        return valor == null ? BigDecimal.ZERO : valor;
    }

    private DestinoLeche destinoValido(String destino) {
        try {
            return DestinoLeche.valueOf(destino);
        } catch (IllegalArgumentException error) {
            return null;
        }
    }

    private static String normalizar(String texto) {
        return Normalizer.normalize(texto == null ? "" : texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT);
    }
}
