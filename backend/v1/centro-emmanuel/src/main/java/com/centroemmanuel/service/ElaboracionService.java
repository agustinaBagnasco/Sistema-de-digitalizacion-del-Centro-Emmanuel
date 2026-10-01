package com.centroemmanuel.service;

import com.centroemmanuel.entity.DetalleElaboracion;
import com.centroemmanuel.entity.Elaboracion;
import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.repository.ElaboracionRepository;
import com.centroemmanuel.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
public class ElaboracionService {

    private final ElaboracionRepository elaboracionRepository;
    private final ProductoRepository productoRepository;
        private final StockService stockService;

    public ElaboracionService(
            ElaboracionRepository elaboracionRepository,
                        ProductoRepository productoRepository,
                        StockService stockService) {

        this.elaboracionRepository = elaboracionRepository;
        this.productoRepository = productoRepository;
                this.stockService = stockService;
    }


    // =========================
    // OBTENER TODAS
    // =========================

    public List<Elaboracion> obtenerTodas() {

        return elaboracionRepository.findAll();
    }


    // =========================
    // OBTENER POR ID
    // =========================

    public Elaboracion obtenerPorId(Integer id) {

        return elaboracionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Elaboración no encontrada"));
    }


    // =========================
    // CREAR ELABORACIÓN
    // =========================

@Transactional
public Elaboracion guardar(Elaboracion elaboracion) {

    /*
     * Si el frontend NO envió producto elaborado,
     * asumimos que es una molienda.
     *
     * En molienda el primer detalle contiene el grano
     * y desde ese grano obtenemos la harina resultante.
     */
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

        /*
         * Molienda:
         * el grano tiene asociado el producto resultado
         * (por ejemplo Trigo -> Harina de trigo)
         */
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

        /*
         * En molienda:
         * cantidad utilizada = cantidad producida
         */
        detalle.setCantidadUtilizada(
                elaboracion.getCantidadProducida()
        );
    }

    /*
     * Vinculamos todos los detalles con la elaboración.
     */
    if (elaboracion.getDetalles() != null) {

        for (DetalleElaboracion detalle :
                elaboracion.getDetalles()) {

            detalle.setElaboracion(elaboracion);

            /*
             * Si no viene costo, podemos tomar el costo actual
             * del producto utilizado.
             */
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

                prepararProductosSalida(elaboracion);

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
                stockService.descontar(
                                insumo,
                                detalle.getCantidadUtilizada(),
                                elaboracion.getUsuario(),
                                "Insumo utilizado en elaboración");
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
                                "Elaboración de " + elaboracion.getProductoElaborado1kg().getNombreProducto());
                tieneSalidas = true;
        }
        if (elaboracion.getCantidadFrascos420g() != null
                        && elaboracion.getCantidadFrascos420g() > 0) {
                stockService.registrarEntrada(
                                elaboracion.getProductoElaborado420g(),
                                BigDecimal.valueOf(elaboracion.getCantidadFrascos420g()),
                                elaboracion.getUsuario().getIdUsuario(),
                                "Elaboración de " + elaboracion.getProductoElaborado420g().getNombreProducto());
                tieneSalidas = true;
        }
        if (!tieneSalidas) {
                stockService.registrarEntrada(
                                productoElaborado,
                                elaboracion.getCantidadProducida(),
                                elaboracion.getUsuario().getIdUsuario(),
                                "Elaboración de " + productoElaborado.getNombreProducto());
        }
}



//     public Elaboracion guardar(Elaboracion elaboracion) {

//         if (elaboracion.getDetalles() != null
//                 && !elaboracion.getDetalles().isEmpty()) {

//             DetalleElaboracion detalle =
//                     elaboracion.getDetalles().get(0);

//             // ID del grano enviado desde React
//             Integer idGrano =
//                     detalle.getInsumoUtilizado().getIdProducto();

//             // Buscamos el grano REAL en la base de datos
//             Producto grano =
//                     productoRepository.findById(idGrano)
//                             .orElseThrow(() ->
//                                     new RuntimeException(
//                                             "El grano seleccionado no existe"
//                                     )
//                             );

//             // Obtenemos la harina asociada al grano
//             Producto productoResultado =
//                     grano.getProductoResultado();

//             if (productoResultado == null) {

//                 throw new RuntimeException(
//                         "El grano seleccionado no tiene un producto elaborado asociado"
//                 );
//             }

//             // La harina será el producto elaborado
//             elaboracion.setProductoElaborado(
//                     productoResultado
//             );

//             // En molienda:
//             // kg utilizados = kg producidos
//             detalle.setCantidadUtilizada(
//                     elaboracion.getCantidadProducida()
//             );

//             // Vinculamos el detalle con la elaboración
//             detalle.setElaboracion(elaboracion);
//         }

//         return elaboracionRepository.save(elaboracion);
//     }


    // =========================
    // ACTUALIZAR
    // =========================

    public Elaboracion actualizar(
        Integer id,
        Elaboracion elaboracion) {

    Elaboracion existente = obtenerPorId(id);

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

    existente.setUsuario(
            elaboracion.getUsuario()
    );

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

        prepararProductosSalida(existente);

    return elaboracionRepository.save(existente);
}

    // =========================
    // ELIMINAR
    // =========================

    public void eliminar(Integer id) {

        elaboracionRepository.deleteById(id);
    }
}