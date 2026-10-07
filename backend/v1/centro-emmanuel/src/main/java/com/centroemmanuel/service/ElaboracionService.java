package com.centroemmanuel.service;

import com.centroemmanuel.entity.DetalleElaboracion;
import com.centroemmanuel.entity.Elaboracion;
import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.enums.Categoria;
import com.centroemmanuel.enums.DestinoLeche;
import com.centroemmanuel.repository.ElaboracionRepository;
import com.centroemmanuel.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@Service
public class ElaboracionService {

    private final ElaboracionRepository elaboracionRepository;
    private final ProductoRepository productoRepository;
        private final StockService stockService;
        private final InventarioLecheService inventarioLecheService;
    private final AutorizacionService autorizacionService;

    public ElaboracionService(
            ElaboracionRepository elaboracionRepository,
                        ProductoRepository productoRepository,
            StockService stockService,
            InventarioLecheService inventarioLecheService,
            AutorizacionService autorizacionService) {

        this.elaboracionRepository = elaboracionRepository;
        this.productoRepository = productoRepository;
                this.stockService = stockService;
        this.inventarioLecheService = inventarioLecheService;
        this.autorizacionService = autorizacionService;
    }



    public List<Elaboracion> obtenerTodas() {

        return elaboracionRepository.findAll();
    }

    public Elaboracion obtenerPorId(Integer id) {

        return elaboracionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Elaboración no encontrada"));
    }

@Transactional
public Elaboracion guardar(Elaboracion elaboracion) {
    if (elaboracion.getProductoElaborado() == null) {

        if (elaboracion.getDetalles() == null
                || elaboracion.getDetalles().isEmpty()) {

            throw new RuntimeException(
                    "La elaboración debe tener al menos un detalle"
            );
        }

        DetalleElaboracion detalle =
                elaboracion.getDetalles().get(0);

        if (detalle.getInsumoUtilizado() == null
                || detalle.getInsumoUtilizado().getIdProducto() == null) {

            throw new RuntimeException(
                    "No se indicó el producto utilizado"
            );
        }

        Integer idProducto =
                detalle.getInsumoUtilizado().getIdProducto();

        Producto producto =
                productoRepository.findById(idProducto)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "El producto utilizado no existe"
                                )
                        );

        Producto productoResultado =
                producto.getProductoResultado();

        if (productoResultado == null) {
            throw new RuntimeException(
                    "El producto seleccionado no tiene un producto elaborado asociado"
            );
        }

        elaboracion.setProductoElaborado(
                productoResultado
        );

        detalle.setCantidadUtilizada(
                elaboracion.getCantidadProducida()
        );
    }

    if (elaboracion.getDetalles() != null) {

        for (DetalleElaboracion detalle :
                elaboracion.getDetalles()) {

            detalle.setElaboracion(elaboracion);

            if (detalle.getInsumoUtilizado() != null
                    && detalle.getInsumoUtilizado().getIdProducto() != null) {

                Producto producto =
                        productoRepository.findById(
                                detalle.getInsumoUtilizado().getIdProducto()
                        ).orElseThrow(() ->
                                new RuntimeException(
                                        "El producto utilizado no existe"
                                )
                        );

                if (detalle.getCostoUnitario() == null
                        && producto.getCosto() != null) {

                                        detalle.setCostoUnitario(producto.getCosto());
                }
            }
        }
    }

        if (elaboracion.getProductoElaborado() == null
                        || elaboracion.getProductoElaborado().getIdProducto() == null) {
                throw new IllegalArgumentException("No se indicó el producto elaborado.");
        }
        if (elaboracion.getCantidadProducida() == null
                        || elaboracion.getCantidadProducida().signum() <= 0) {
                throw new IllegalArgumentException("La cantidad producida debe ser mayor que cero.");
        }
        if (elaboracion.getUsuario() == null || elaboracion.getUsuario().getIdUsuario() == 0) {
                throw new IllegalArgumentException("No se indicó el usuario que registra la elaboración.");
        }

        Integer idProducto = elaboracion.getProductoElaborado().getIdProducto();
        Producto productoElaborado = productoRepository.findById(idProducto)
                        .orElseThrow(() -> new IllegalArgumentException("El producto elaborado no existe."));
        elaboracion.setProductoElaborado(productoElaborado);
        normalizarCantidadQueso(elaboracion);

                prepararProductosSalida(elaboracion);
                validarConsumoLeche(elaboracion, null);

        Elaboracion guardada = elaboracionRepository.save(elaboracion);
                registrarConsumoInsumos(guardada);
                registrarStockSalida(guardada, productoElaborado);
        return guardada;
}

private void registrarConsumoInsumos(Elaboracion elaboracion) {
        if (elaboracion.getDetalles() == null) {
                return;
        }

        for (DetalleElaboracion detalle : elaboracion.getDetalles()) {
                if (detalle.getInsumoUtilizado() == null
                                || detalle.getInsumoUtilizado().getIdProducto() == null
                                || detalle.getCantidadUtilizada() == null
                                || detalle.getCantidadUtilizada().signum() <= 0) {
                        continue;
                }

                Producto insumo = productoRepository.findById(
                                detalle.getInsumoUtilizado().getIdProducto())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "El insumo utilizado no existe."));
                DestinoLeche destino = insumo.getCategoria() == Categoria.LECHE
                        ? destinoLeche(elaboracion) : null;
                stockService.descontar(
                                insumo,
                                detalle.getCantidadUtilizada(),
                                elaboracion.getUsuario(),
                                descripcionLote(elaboracion)
                                        + (destino != null
                                                ? " · Destino de la leche: " + destino.getEtiqueta()
                                                : ""),
                                destino);
        }
}

private void prepararProductosSalida(Elaboracion elaboracion) {
        if (elaboracion.getCantidadFrascos1kg() != null
                        && elaboracion.getCantidadFrascos1kg() > 0) {
                elaboracion.setProductoElaborado1kg(buscarProductoSalida(
                                elaboracion.getProductoElaborado1kg(), "1 kg"));
        }
        if (elaboracion.getCantidadFrascos420g() != null
                        && elaboracion.getCantidadFrascos420g() > 0) {
                elaboracion.setProductoElaborado420g(buscarProductoSalida(
                                elaboracion.getProductoElaborado420g(), "420 g"));
        }
}

private Producto buscarProductoSalida(Producto producto, String presentacion) {
        if (producto == null || producto.getIdProducto() == null) {
                throw new IllegalArgumentException(
                                "Debe indicar el producto de salida de " + presentacion + ".");
        }
        return productoRepository.findById(producto.getIdProducto())
                        .orElseThrow(() -> new IllegalArgumentException(
                                        "El producto de salida de " + presentacion + " no existe."));
}

private void registrarStockSalida(Elaboracion elaboracion, Producto productoElaborado) {
        boolean tieneSalidas = false;
        if (elaboracion.getCantidadFrascos1kg() != null
                        && elaboracion.getCantidadFrascos1kg() > 0) {
                stockService.registrarEntrada(
                                elaboracion.getProductoElaborado1kg(),
                                BigDecimal.valueOf(elaboracion.getCantidadFrascos1kg()),
                                elaboracion.getUsuario().getIdUsuario(),
                                descripcionLote(elaboracion));
                tieneSalidas = true;
        }
        if (elaboracion.getCantidadFrascos420g() != null
                        && elaboracion.getCantidadFrascos420g() > 0) {
                stockService.registrarEntrada(
                                elaboracion.getProductoElaborado420g(),
                                BigDecimal.valueOf(elaboracion.getCantidadFrascos420g()),
                                elaboracion.getUsuario().getIdUsuario(),
                                descripcionLote(elaboracion));
                tieneSalidas = true;
        }
        if (!tieneSalidas) {
                stockService.registrarEntrada(
                                productoElaborado,
                                elaboracion.getCantidadProducida(),
                                elaboracion.getUsuario().getIdUsuario(),
                                descripcionLote(elaboracion));
        }
}


    @Transactional
    public Elaboracion actualizar(
        Integer id,
        Elaboracion elaboracion,
        Integer idActor) {

    Elaboracion existente = obtenerPorId(id);
    autorizacionService.validarResponsable(existente.getUsuario(), idActor);
    List<ConsumoLeche> consumosAnteriores = consumosLeche(existente);

    existente.setProductoElaborado(
            elaboracion.getProductoElaborado()
    );

    existente.setFechaElaboracion(
            elaboracion.getFechaElaboracion()
    );

    existente.setTiempoElaboracion(
            elaboracion.getTiempoElaboracion()
    );

    existente.setCantidadProducida(
            elaboracion.getCantidadProducida()
    );

    existente.setCantidadFrascos1kg(
            elaboracion.getCantidadFrascos1kg()
    );

    existente.setCantidadFrascos420g(
            elaboracion.getCantidadFrascos420g()
    );

    existente.setProductoElaborado1kg(
            elaboracion.getProductoElaborado1kg()
    );

    existente.setProductoElaborado420g(
            elaboracion.getProductoElaborado420g()
    );
    existente.setCantidadHormas(elaboracion.getCantidadHormas());

    existente.setObservaciones(
            elaboracion.getObservaciones()
    );

    if (elaboracion.getDetalles() != null) {

        existente.getDetalles().clear();

        for (DetalleElaboracion detalle :
                elaboracion.getDetalles()) {

            detalle.setElaboracion(existente);
            existente.getDetalles().add(detalle);
        }
    }

        normalizarCantidadQueso(existente);
        prepararProductosSalida(existente);
        validarConsumoLeche(existente, id);

    Elaboracion actualizada = elaboracionRepository.save(existente);
    sincronizarConsumoLeche(
            consumosAnteriores, consumosLeche(actualizada), actualizada.getUsuario(), actualizada);
    return actualizada;
}

    private List<ConsumoLeche> consumosLeche(Elaboracion elaboracion) {
        DestinoLeche destino = destinoLeche(elaboracion);
        if (destino == null || elaboracion.getDetalles() == null) {
            return List.of();
        }
        java.util.Map<Integer, BigDecimal> cantidades = new java.util.LinkedHashMap<>();
        for (DetalleElaboracion detalle : elaboracion.getDetalles()) {
            Integer idProducto = detalle.getInsumoUtilizado() == null
                    ? null : detalle.getInsumoUtilizado().getIdProducto();
            if (idProducto == null || detalle.getCantidadUtilizada() == null) {
                continue;
            }
            Producto insumo = productoRepository.findById(idProducto)
                    .orElseThrow(() -> new IllegalArgumentException("El insumo utilizado no existe."));
            if (insumo.getCategoria() == Categoria.LECHE) {
                cantidades.merge(idProducto, detalle.getCantidadUtilizada(), BigDecimal::add);
            }
        }
        return cantidades.entrySet().stream()
                .map(entry -> new ConsumoLeche(entry.getKey(), destino, entry.getValue()))
                .toList();
    }

    private void sincronizarConsumoLeche(
            List<ConsumoLeche> anteriores,
            List<ConsumoLeche> actuales,
            com.centroemmanuel.entity.Usuario usuario,
            Elaboracion elaboracion) {
        java.util.Map<String, ConsumoLeche> antes = consumosPorClave(anteriores);
        java.util.Map<String, ConsumoLeche> despues = consumosPorClave(actuales);
        java.util.Set<String> claves = new java.util.LinkedHashSet<>(antes.keySet());
        claves.addAll(despues.keySet());
        for (String clave : claves) {
            ConsumoLeche anterior = antes.get(clave);
            ConsumoLeche actual = despues.get(clave);
            BigDecimal cantidadAnterior = anterior == null ? BigDecimal.ZERO : anterior.cantidad();
            BigDecimal cantidadActual = actual == null ? BigDecimal.ZERO : actual.cantidad();
            BigDecimal diferencia = cantidadActual.subtract(cantidadAnterior);
            if (diferencia.signum() == 0) {
                continue;
            }
            ConsumoLeche referencia = actual == null ? anterior : actual;
            Producto leche = productoRepository.findById(referencia.idProducto())
                    .orElseThrow(() -> new IllegalArgumentException("El producto Leche no existe."));
            if (diferencia.signum() > 0) {
                stockService.descontar(
                        leche,
                        diferencia,
                        usuario,
                        descripcionLote(elaboracion)
                                + " · Destino de la leche: " + referencia.destino().getEtiqueta(),
                        referencia.destino());
            } else {
                stockService.registrarEntrada(
                        leche,
                        diferencia.abs(),
                        usuario.getIdUsuario(),
                        "Reintegro por modificación · " + descripcionLote(elaboracion) + " · Destino de la leche: "
                                + referencia.destino().getEtiqueta(),
                        referencia.destino());
            }
        }
    }

    private java.util.Map<String, ConsumoLeche> consumosPorClave(List<ConsumoLeche> consumos) {
        java.util.Map<String, ConsumoLeche> resultado = new java.util.LinkedHashMap<>();
        for (ConsumoLeche consumo : consumos) {
            resultado.put(consumo.idProducto() + ":" + consumo.destino(), consumo);
        }
        return resultado;
    }

    private String descripcionLote(Elaboracion elaboracion) {
        String nombre = nombreProducto(elaboracion);
        String sigla = Normalizer.normalize(nombre, Normalizer.Form.NFD)
                .replaceAll("[^A-Za-z]", "").toUpperCase(Locale.ROOT);
        sigla = sigla.length() > 3 ? sigla.substring(0, 3) : sigla;
        java.time.LocalDate fecha = elaboracion.getFechaElaboracion();
        String codigo = sigla + "-"
                + (fecha == null ? "" : fecha.format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE))
                + "-" + elaboracion.getIdElaboracion();

        StringBuilder texto = new StringBuilder("Lote " + codigo + " · Elaboración #"
                + elaboracion.getIdElaboracion());
        if (fecha != null) {
            texto.append(" · ").append(fecha.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        }
        if (elaboracion.getUsuario() != null && elaboracion.getUsuario().getNombreUsuario() != null) {
            texto.append(" · Responsable: ").append(elaboracion.getUsuario().getNombreUsuario());
        }
        texto.append(". Producido: ").append(descripcionProducido(elaboracion)).append(".");

        List<String> insumos = new java.util.ArrayList<>();
        if (elaboracion.getDetalles() != null) {
            for (DetalleElaboracion detalle : elaboracion.getDetalles()) {
                if (detalle.getInsumoUtilizado() == null || detalle.getCantidadUtilizada() == null
                        || detalle.getCantidadUtilizada().signum() <= 0) {
                    continue;
                }
                String nombreInsumo = productoRepository
                        .findById(detalle.getInsumoUtilizado().getIdProducto())
                        .map(Producto::getNombreProducto).orElse("Insumo");
                insumos.add(nombreInsumo + " "
                        + detalle.getCantidadUtilizada().stripTrailingZeros().toPlainString());
            }
        }
        if (!insumos.isEmpty()) {
            texto.append(" Insumos usados: ").append(String.join(", ", insumos)).append(".");
        }
        if (elaboracion.getObservaciones() != null && !elaboracion.getObservaciones().isBlank()) {
            texto.append(" Observaciones: ").append(elaboracion.getObservaciones().trim());
        }
        String resultado = texto.toString();
        return resultado.length() > 990 ? resultado.substring(0, 990) : resultado;
    }

    private String descripcionProducido(Elaboracion elaboracion) {
        List<String> partes = new java.util.ArrayList<>();
        if (elaboracion.getCantidadFrascos1kg() != null && elaboracion.getCantidadFrascos1kg() > 0) {
            partes.add(elaboracion.getCantidadFrascos1kg() + " frascos de 1 kg");
        }
        if (elaboracion.getCantidadFrascos420g() != null && elaboracion.getCantidadFrascos420g() > 0) {
            partes.add(elaboracion.getCantidadFrascos420g() + " frascos de 420 g");
        }
        if (elaboracion.getCantidadHormas() != null && elaboracion.getCantidadHormas() > 0) {
            partes.add(elaboracion.getCantidadHormas() + " hormas");
        }
        String base = nombreProducto(elaboracion);
        if (elaboracion.getCantidadProducida() != null) {
            String total = elaboracion.getCantidadProducida().stripTrailingZeros().toPlainString();
            return base + " · " + (partes.isEmpty() ? total : String.join(" y ", partes) + " (" + total + " en total)");
        }
        return base;
    }
    private String nombreProducto(Elaboracion elaboracion) {
        return elaboracion.getProductoElaborado() == null
                ? "elaboración" : elaboracion.getProductoElaborado().getNombreProducto();
    }

    private record ConsumoLeche(Integer idProducto, DestinoLeche destino, BigDecimal cantidad) {
    }

    private void validarConsumoLeche(Elaboracion elaboracion, Integer idExcluido) {
        DestinoLeche destino = destinoLeche(elaboracion);
        if (elaboracion.getDetalles() == null) {
            return;
        }
        BigDecimal litrosLeche = BigDecimal.ZERO;
        for (DetalleElaboracion detalle : elaboracion.getDetalles()) {
            if (detalle.getInsumoUtilizado() == null
                    || detalle.getInsumoUtilizado().getIdProducto() == null) {
                continue;
            }
            Producto insumo = productoRepository.findById(detalle.getInsumoUtilizado().getIdProducto())
                    .orElseThrow(() -> new IllegalArgumentException("El insumo utilizado no existe."));
            if (insumo.getCategoria() == Categoria.LECHE && destino == null) {
                throw new IllegalArgumentException(
                        "No se pudo identificar el área de destino para la leche utilizada.");
            }
            if (insumo.getCategoria() == Categoria.LECHE && detalle.getCantidadUtilizada() != null) {
                litrosLeche = litrosLeche.add(detalle.getCantidadUtilizada());
            }
        }
        if (destino == DestinoLeche.DULCE_DE_LECHE) {
            validarRendimientoDulceDeLeche(elaboracion, litrosLeche);
        }
        if (litrosLeche.signum() > 0) {
            inventarioLecheService.validarUso(destino, litrosLeche, idExcluido);
        }
    }

    // 1 litro de leche rinde como máximo 1 kg de dulce de leche
    private void validarRendimientoDulceDeLeche(Elaboracion elaboracion, BigDecimal litrosLeche) {
        int frascos1kg = elaboracion.getCantidadFrascos1kg() == null ? 0 : elaboracion.getCantidadFrascos1kg();
        int frascos420g = elaboracion.getCantidadFrascos420g() == null ? 0 : elaboracion.getCantidadFrascos420g();
        BigDecimal kilosProducidos = BigDecimal.valueOf(frascos1kg)
                .add(BigDecimal.valueOf(frascos420g).multiply(new BigDecimal("0.420")));
        if (kilosProducidos.compareTo(litrosLeche) > 0) {
            throw new IllegalArgumentException("Con " + litrosLeche.stripTrailingZeros().toPlainString()
                    + " L de leche se pueden producir como máximo "
                    + litrosLeche.stripTrailingZeros().toPlainString() + " kg de dulce de leche ("
                    + kilosProducidos.stripTrailingZeros().toPlainString() + " kg ingresados).");
        }
    }

    private DestinoLeche destinoLeche(Elaboracion elaboracion) {
        return InventarioLecheService.destinoDeElaboracion(elaboracion.getProductoElaborado());
    }

    private void normalizarCantidadQueso(Elaboracion elaboracion) {
        if (elaboracion.getProductoElaborado() == null
                || elaboracion.getProductoElaborado().getIdProducto() == null) {
            return;
        }

        Producto producto = productoRepository.findById(elaboracion.getProductoElaborado().getIdProducto())
                .orElseThrow(() -> new IllegalArgumentException("El producto elaborado no existe."));
        elaboracion.setProductoElaborado(producto);
        normalizarCantidadQueso(elaboracion, producto);
    }

    static void normalizarCantidadQueso(Elaboracion elaboracion, Producto producto) {
        if (producto.getCategoria() != Categoria.QUESO) {
            elaboracion.setCantidadHormas(null);
            return;
        }

        if (producto.getUnidadMedida() == com.centroemmanuel.enums.UnidadMedida.UNIDAD) {
            elaboracion.setCantidadHormas(null);
            return;
        }

        BigDecimal pesoHorma = producto.getPesoHorma();
        if (pesoHorma == null) {
            throw new IllegalArgumentException(
                    "El queso no tiene configurado el peso de su horma: "
                            + producto.getNombreProducto() + ".");
        }
        if (pesoHorma.signum() < 0) {
            throw new IllegalArgumentException("El peso de la horma no puede ser negativo.");
        }
        if (pesoHorma.signum() == 0) {
            elaboracion.setCantidadHormas(null);
            return;
        }

        Integer cantidadHormas = elaboracion.getCantidadHormas();
        if (cantidadHormas == null && elaboracion.getCantidadProducida() != null
                && elaboracion.getCantidadProducida().stripTrailingZeros().scale() <= 0) {
            cantidadHormas = elaboracion.getCantidadProducida().intValueExact();
        }
        if (cantidadHormas == null || cantidadHormas <= 0) {
            throw new IllegalArgumentException("La cantidad de hormas debe ser un entero mayor que cero.");
        }

        elaboracion.setCantidadHormas(cantidadHormas);
        elaboracion.setCantidadProducida(convertirHormasAKilos(cantidadHormas, pesoHorma));
    }

    static BigDecimal convertirHormasAKilos(int cantidadHormas, BigDecimal pesoHorma) {
        if (cantidadHormas <= 0) {
            throw new IllegalArgumentException("La cantidad de hormas debe ser un entero mayor que cero.");
        }
        if (pesoHorma == null || pesoHorma.signum() <= 0) {
            throw new IllegalArgumentException("El peso de la horma debe ser mayor que cero.");
        }
        return BigDecimal.valueOf(cantidadHormas).multiply(pesoHorma);
    }
    
    @Transactional
    public void eliminar(Integer id, Integer idActor) {
        Elaboracion elaboracion = obtenerPorId(id);
        autorizacionService.validarResponsable(elaboracion.getUsuario(), idActor);
        for (ConsumoLeche consumo : consumosLeche(elaboracion)) {
            Producto leche = productoRepository.findById(consumo.idProducto())
                    .orElseThrow(() -> new IllegalArgumentException("El producto Leche no existe."));
            stockService.registrarEntrada(
                    leche,
                    consumo.cantidad(),
                    elaboracion.getUsuario().getIdUsuario(),
                    "Reintegro por eliminación de elaboración · destino: "
                            + consumo.destino().getEtiqueta(),
                    consumo.destino());
        }
        elaboracionRepository.delete(elaboracion);
    }
}