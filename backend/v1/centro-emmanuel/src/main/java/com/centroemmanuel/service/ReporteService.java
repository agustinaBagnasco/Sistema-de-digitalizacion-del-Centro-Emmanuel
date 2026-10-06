package com.centroemmanuel.service;

import com.centroemmanuel.dto.ReporteRequest;
import com.centroemmanuel.dto.ReporteResponse;
import com.centroemmanuel.dto.ReporteMensualResumen;
import com.centroemmanuel.dto.InventarioLeche;
import com.centroemmanuel.dto.InventarioLecheResponse;
import com.centroemmanuel.entity.Cosecha;
import com.centroemmanuel.entity.DetalleElaboracion;
import com.centroemmanuel.entity.DetalleVenta;
import com.centroemmanuel.entity.Elaboracion;
import com.centroemmanuel.entity.MovimientoStock;
import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.entity.ProduccionLeche;
import com.centroemmanuel.entity.Venta;
import com.centroemmanuel.repository.CosechaRepository;
import com.centroemmanuel.repository.ElaboracionRepository;
import com.centroemmanuel.repository.MovimientoStockRepository;
import org.springframework.stereotype.Service;
import com.centroemmanuel.repository.ProductoRepository;
import com.centroemmanuel.repository.ProduccionLecheRepository;
import com.centroemmanuel.repository.VentaRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class ReporteService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ReporteService.class);
    private final ProductoRepository productoRepository;
    private final VentaRepository ventaRepository;
    private final ProduccionLecheRepository produccionLecheRepository;
    private final ElaboracionRepository elaboracionRepository;
    private final CosechaRepository cosechaRepository;
    private final MovimientoStockRepository movimientoStockRepository;
    private final InventarioLecheService inventarioLecheService;
    private final Path directorioReportesMensuales;

    public ReporteService(
            ProductoRepository productoRepository,
            VentaRepository ventaRepository,
            ProduccionLecheRepository produccionLecheRepository,
            ElaboracionRepository elaboracionRepository,
            CosechaRepository cosechaRepository,
            MovimientoStockRepository movimientoStockRepository,
            InventarioLecheService inventarioLecheService,
            @Value("${reportes.mensuales.directorio:./data/reportes-mensuales}") String directorioReportesMensuales
    ) {
        this.productoRepository = productoRepository;
        this.ventaRepository = ventaRepository;
        this.produccionLecheRepository = produccionLecheRepository;
        this.elaboracionRepository = elaboracionRepository;
        this.cosechaRepository = cosechaRepository;
        this.movimientoStockRepository = movimientoStockRepository;
        this.inventarioLecheService = inventarioLecheService;
        this.directorioReportesMensuales = Path.of(directorioReportesMensuales).toAbsolutePath().normalize();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void completarMesCerradoAlIniciar() {
        try {
            generarMesAnterior();
        } catch (RuntimeException error) {
            LOGGER.error("No se pudo generar el reporte mensual pendiente al iniciar.", error);
        }
    }

    @Scheduled(
            cron = "${reportes.mensuales.cron:0 0 8 1 * *}",
            zone = "${reportes.mensuales.zona-horaria:America/Argentina/Buenos_Aires}"
    )
    public void generarMesAnterior() {
        YearMonth periodo = YearMonth.now().minusMonths(1);
        generarMensualSiNoExiste(periodo);
    }

    @Transactional
    public List<ReporteMensualResumen> listarMensuales() {
        try {
            Files.createDirectories(directorioReportesMensuales);
            try (var archivos = Files.list(directorioReportesMensuales)) {
                return archivos
                        .filter(this::esArchivoMensual)
                        .map(path -> resumenMensual(path, periodoDeArchivo(path)))
                        .sorted((primero, segundo) -> segundo.periodo().compareTo(primero.periodo()))
                        .toList();
            }
        } catch (IOException error) {
            throw new IllegalStateException("No se pudieron listar los reportes mensuales.", error);
        }
    }

    @Transactional
    public byte[] obtenerMensual(String periodo) {
        YearMonth periodoValidado = validarPeriodo(periodo);
        Path archivo = archivoMensual(periodoValidado);
        if (!Files.isRegularFile(archivo)) {
            throw new IllegalArgumentException("No existe un reporte mensual para el período solicitado.");
        }
        generarMensualSiNoExiste(periodoValidado);
        try {
            return Files.readAllBytes(archivo);
        } catch (IOException error) {
            throw new IllegalStateException("No se pudo leer el archivo del reporte mensual.", error);
        }
    }

    public void generarMensualSiNoExiste(YearMonth periodo) {
        Path archivo = archivoMensual(periodo);
        if (Files.isRegularFile(archivo)
                && tieneTotalGeneralRecaudado(archivo)
                && tieneHojaResumenLeche(archivo)) return;
        byte[] contenido = crearExcelMensual(periodo, resumirProductosMensual(periodo));
        guardarArchivoMensual(archivo, contenido);
    }

    private boolean tieneTotalGeneralRecaudado(Path archivo) {
        try (var entrada = Files.newInputStream(archivo);
                Workbook libro = new XSSFWorkbook(entrada)) {
            Sheet hoja = libro.getSheetAt(0);
            for (Row fila : hoja) {
                Cell celda = fila.getCell(0);
                if (celda != null && "TOTAL GENERAL RECAUDADO".equalsIgnoreCase(celda.toString().trim())) {
                    return true;
                }
            }
            return false;
        } catch (IOException error) {
            throw new IllegalStateException("No se pudo comprobar el total del reporte mensual.", error);
        }
    }

    private boolean tieneHojaResumenLeche(Path archivo) {
        try (var entrada = Files.newInputStream(archivo);
                Workbook libro = new XSSFWorkbook(entrada)) {
            return libro.getSheet("Leche mensual") != null;
        } catch (IOException error) {
            throw new IllegalStateException("No se pudo comprobar el resumen mensual de leche.", error);
        }
    }

    @Transactional
    public ReporteMensualResumen generarMensualPrueba(String periodoSolicitado) {
        YearMonth periodo = validarPeriodo(periodoSolicitado);
        if (!periodo.isBefore(YearMonth.now())) {
            throw new IllegalArgumentException("Solo se pueden generar reportes de meses ya cerrados.");
        }

        Path archivo = archivoMensual(periodo);
        generarMensualSiNoExiste(periodo);
        return resumenMensual(archivo, periodo);
    }

    private List<ProductoResumenMensual> resumirProductosMensual(YearMonth periodo) {
        return resumirProductos(periodo.atDay(1), periodo.plusMonths(1).atDay(1));
    }

    private List<ProductoResumenMensual> resumirProductos(LocalDate primerDia, LocalDate primerDiaSiguiente) {
        Map<Integer, ProductoResumenMensual> porProducto = new LinkedHashMap<>();
        for (Producto producto : productoRepository.findAll()) {
            porProducto.put(producto.getIdProducto(), new ProductoResumenMensual(producto));
        }

        LocalDateTime inicio = primerDia.atStartOfDay();
        LocalDateTime fin = primerDiaSiguiente.atStartOfDay();
        for (MovimientoStock movimiento :
                movimientoStockRepository.findByFechaMovGreaterThanEqualAndFechaMovLessThan(inicio, fin)) {
            if (movimiento.getProductoMov() == null) {
                continue;
            }
            ProductoResumenMensual resumen = porProducto.get(movimiento.getProductoMov().getIdProducto());
            if (resumen == null) {
                continue;
            }
            if ("ENTRADA".equalsIgnoreCase(movimiento.getTipoMov())) {
                resumen.entradas = resumen.entradas.add(ceroSiNulo(movimiento.getCantidadMov()));
            } else if ("SALIDA".equalsIgnoreCase(movimiento.getTipoMov())) {
                resumen.salidas = resumen.salidas.add(ceroSiNulo(movimiento.getCantidadMov()));
            }
        }

        for (Venta venta : ventaRepository.findWithDetailsForPeriod(primerDia, primerDiaSiguiente)) {
            for (DetalleVenta detalle : venta.getDetalleVenta()) {
                Producto producto = detalle.getProductoVendido();
                if (producto == null || !porProducto.containsKey(producto.getIdProducto())) {
                    continue;
                }
                ProductoResumenMensual resumen = porProducto.get(producto.getIdProducto());
                BigDecimal cantidad = ceroSiNulo(detalle.getCantidadDV());
                BigDecimal subtotal = detalle.getSubtotal() == null
                        ? ceroSiNulo(detalle.getPrecioUnitario()).multiply(cantidad)
                        : detalle.getSubtotal();
                resumen.cantidadVendida = resumen.cantidadVendida.add(cantidad);
                resumen.totalVentas = resumen.totalVentas.add(subtotal);
            }
        }

        return new ArrayList<>(porProducto.values());
    }

    private byte[] crearExcelMensual(YearMonth periodo, List<ProductoResumenMensual> productos) {
        String titulo = periodo.getMonth().getDisplayName(TextStyle.FULL, Locale.forLanguageTag("es"))
                + " " + periodo.getYear();
        return crearExcelMensual(titulo, productos, periodo.atDay(1), periodo.atEndOfMonth());
    }

    @Transactional(readOnly = true)
    public byte[] generarMensualPruebaTodosLosDatos() {
        LocalDate desde = LocalDate.of(2000, 1, 1);
        LocalDate hasta = LocalDate.of(2100, 12, 31);
        return crearExcelMensual("PRUEBA - todos los datos del sistema como un solo mes",
                resumirProductos(desde, hasta.plusDays(1)), desde, hasta);
    }

    private byte[] crearExcelMensual(String titulo, List<ProductoResumenMensual> productos,
            LocalDate desde, LocalDate hasta) {
        try (Workbook libro = new XSSFWorkbook(); ByteArrayOutputStream salida = new ByteArrayOutputStream()) {
            Sheet hoja = libro.createSheet("Reporte mensual");
            hoja.createRow(0).createCell(0).setCellValue("Reporte general mensual");
            hoja.createRow(1).createCell(0).setCellValue(titulo);

            String[] columnas = {
                    "Producto / Insumo", "Tipo", "Unidad", "Entradas", "Salidas",
                    "Cantidad vendida", "Total ventas"
            };
            CellStyle estiloEncabezado = libro.createCellStyle();
            Font fuente = libro.createFont();
            fuente.setBold(true);
            estiloEncabezado.setFont(fuente);
            Row encabezado = hoja.createRow(3);
            for (int indice = 0; indice < columnas.length; indice++) {
                Cell celda = encabezado.createCell(indice);
                celda.setCellValue(columnas[indice]);
                celda.setCellStyle(estiloEncabezado);
            }

            int numeroFila = 4;
            for (ProductoResumenMensual producto : productos) {
                Row fila = hoja.createRow(numeroFila++);
                fila.createCell(0).setCellValue(producto.producto.getNombreProducto());
                fila.createCell(1).setCellValue(producto.producto.getTipo() == null
                        ? "" : producto.producto.getTipo().name());
                fila.createCell(2).setCellValue(producto.producto.getUnidadMedida() == null
                        ? "" : producto.producto.getUnidadMedida().name());
                fila.createCell(3).setCellValue(producto.entradas.doubleValue());
                fila.createCell(4).setCellValue(producto.salidas.doubleValue());
                fila.createCell(5).setCellValue(producto.cantidadVendida.doubleValue());
                fila.createCell(6).setCellValue(producto.totalVentas.doubleValue());
            }

            crearHojaResumenLeche(libro, desde, hasta);

            BigDecimal totalGeneralVentas = productos.stream()
                    .map(producto -> producto.totalVentas)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            Row filaTotal = hoja.createRow(numeroFila);
            Cell etiquetaTotal = filaTotal.createCell(0);
            etiquetaTotal.setCellValue("TOTAL GENERAL RECAUDADO");
            etiquetaTotal.setCellStyle(estiloEncabezado);
            Cell celdaTotal = filaTotal.createCell(6);
            celdaTotal.setCellValue(totalGeneralVentas.doubleValue());
            celdaTotal.setCellStyle(estiloEncabezado);

            hoja.createFreezePane(0, 4);
            hoja.setAutoFilter(new org.apache.poi.ss.util.CellRangeAddress(
                    3, Math.max(3, numeroFila - 1), 0, columnas.length - 1));
            for (int indice = 0; indice < columnas.length; indice++) {
                hoja.autoSizeColumn(indice);
            }

            libro.write(salida);
            return salida.toByteArray();
        } catch (IOException error) {
            throw new IllegalStateException("No se pudo crear el archivo Excel del reporte mensual.", error);
        }
    }

    private void crearHojaResumenLeche(Workbook libro, LocalDate desde, LocalDate hasta) {
        InventarioLecheResponse resumen = inventarioLecheService.obtenerResumen(desde, hasta);
        Sheet hoja = libro.createSheet("Leche mensual");
        String[] columnas = {"Destino / resumen", "Litros producidos", "Litros asignados",
                "Litros utilizados", "Litros disponibles"};
        CellStyle estiloEncabezado = libro.createCellStyle();
        Font fuente = libro.createFont();
        fuente.setBold(true);
        estiloEncabezado.setFont(fuente);
        Row encabezado = hoja.createRow(0);
        for (int indice = 0; indice < columnas.length; indice++) {
            Cell celda = encabezado.createCell(indice);
            celda.setCellValue(columnas[indice]);
            celda.setCellStyle(estiloEncabezado);
        }

        Row total = hoja.createRow(1);
        total.createCell(0).setCellValue("TOTAL");
        total.createCell(1).setCellValue(resumen.litrosTotales().doubleValue());
        total.createCell(2).setCellValue(resumen.litrosAsignados().doubleValue());
        total.createCell(3).setCellValue(resumen.litrosUtilizados().doubleValue());
        total.createCell(4).setCellValue(resumen.litrosAsignados()
                .subtract(resumen.litrosUtilizados()).doubleValue());
        for (Cell celda : total) {
            celda.setCellStyle(estiloEncabezado);
        }

        int numeroFila = 2;
        for (InventarioLeche area : resumen.areas()) {
            Row fila = hoja.createRow(numeroFila++);
            fila.createCell(0).setCellValue(area.etiqueta());
            fila.createCell(1).setCellValue(0);
            fila.createCell(2).setCellValue(area.asignado().doubleValue());
            fila.createCell(3).setCellValue(area.utilizado().doubleValue());
            fila.createCell(4).setCellValue(area.disponible().doubleValue());
        }
        hoja.createFreezePane(0, 1);
        for (int indice = 0; indice < columnas.length; indice++) {
            hoja.autoSizeColumn(indice);
        }
    }

    private boolean esArchivoMensual(Path archivo) {
        String nombre = archivo.getFileName().toString();
        if (!nombre.matches("\\d{4}-\\d{2}\\.xlsx")) {
            return false;
        }
        try {
            YearMonth.parse(nombre.substring(0, 7));
            return true;
        } catch (RuntimeException error) {
            return false;
        }
    }

    private YearMonth periodoDeArchivo(Path archivo) {
        return YearMonth.parse(archivo.getFileName().toString().substring(0, 7));
    }

    private YearMonth validarPeriodo(String periodo) {
        try {
            return YearMonth.parse(periodo);
        } catch (RuntimeException error) {
            throw new IllegalArgumentException("El período debe tener el formato AAAA-MM.", error);
        }
    }

    private Path archivoMensual(YearMonth periodo) {
        return directorioReportesMensuales.resolve(periodo + ".xlsx");
    }

    private ReporteMensualResumen resumenMensual(Path archivo, YearMonth periodo) {
        return new ReporteMensualResumen(
                periodo.toString(),
                fechaModificacion(archivo));
    }

    private LocalDateTime fechaModificacion(Path archivo) {
        try {
            return LocalDateTime.ofInstant(
                    Files.getLastModifiedTime(archivo).toInstant(), java.time.ZoneId.systemDefault());
        } catch (IOException error) {
            throw new IllegalStateException("No se pudo consultar la fecha del reporte mensual.", error);
        }
    }

    private void guardarArchivoMensual(Path archivo, byte[] contenido) {
        guardarArchivoAtomico(archivo, salida -> salida.write(contenido));
    }

    private void guardarArchivoAtomico(Path archivo, EscritorArchivo escritor) {
        try {
            Files.createDirectories(directorioReportesMensuales);
            Path temporal = Files.createTempFile(directorioReportesMensuales, "reporte-", ".tmp");
            try {
                try (OutputStream salida = Files.newOutputStream(temporal)) {
                    escritor.escribir(salida);
                }
                try {
                    Files.move(temporal, archivo, StandardCopyOption.ATOMIC_MOVE,
                            StandardCopyOption.REPLACE_EXISTING);
                } catch (AtomicMoveNotSupportedException error) {
                    Files.move(temporal, archivo, StandardCopyOption.REPLACE_EXISTING);
                }
            } finally {
                Files.deleteIfExists(temporal);
            }
        } catch (IOException error) {
            throw new IllegalStateException("No se pudo guardar el reporte mensual en disco.", error);
        }
    }

    @FunctionalInterface
    private interface EscritorArchivo {
        void escribir(OutputStream salida) throws IOException;
    }

    private static class ProductoResumenMensual {
        private final Producto producto;
        private BigDecimal entradas = BigDecimal.ZERO;
        private BigDecimal salidas = BigDecimal.ZERO;
        private BigDecimal cantidadVendida = BigDecimal.ZERO;
        private BigDecimal totalVentas = BigDecimal.ZERO;

        private ProductoResumenMensual(Producto producto) {
            this.producto = producto;
        }
    }

    @Transactional(readOnly = true)
    public ReporteResponse generar(ReporteRequest request) {
        if (request == null || request.getTipo() == null || request.getTipo().isBlank()) {
            throw new IllegalArgumentException("Debe seleccionar un tipo de reporte.");
        }
        LocalDate desde = request.getFechaDesde();
        LocalDate hasta = request.getFechaHasta();
        if (desde != null && hasta != null && desde.isAfter(hasta)) {
            throw new IllegalArgumentException("La fecha desde no puede ser posterior a la fecha hasta.");
        }

        String tipo = request.getTipo().trim().toUpperCase();
        return switch (tipo) {
            case "PRODUCCION" -> reporteProduccion(desde, hasta);
            case "STOCK" -> reporteStock(desde, hasta);
            case "VENTAS" -> reporteVentas(desde, hasta);
            case "INSUMOS", "COSTOS" -> reporteInsumos(desde, hasta);
            default -> throw new IllegalArgumentException("El tipo de reporte seleccionado no es válido.");
        };
    }

    private ReporteResponse reporteProduccion(LocalDate desde, LocalDate hasta) {
        List<String> columnas = List.of(
                "Fecha", "Origen", "Producto/Concepto", "Cantidad", "Unidad", "Observaciones", "Responsable");
        List<Map<String, Object>> filas = new ArrayList<>();
        Map<String, BigDecimal> totales = new LinkedHashMap<>();
        InventarioLecheResponse resumenLeche = inventarioLecheService.obtenerResumen(desde, hasta);
        int filasResumenLeche = 1 + resumenLeche.areas().size() * 2;
        List<ProduccionLeche> produccionesPeriodo = produccionLecheRepository.findAll().stream()
                .filter(produccion -> incluida(produccion.getFecha(), desde, hasta))
                .toList();
        LocalDate fechaResumenLeche = produccionesPeriodo.stream()
                .map(ProduccionLeche::getFecha)
                .filter(java.util.Objects::nonNull)
                .max(LocalDate::compareTo)
                .orElse(null);
        String responsableResumenLeche = produccionesPeriodo.stream()
                .map(produccion -> nombreResponsable(produccion.getUsuario()))
                .filter(nombre -> !nombre.isBlank())
                .distinct()
                .collect(java.util.stream.Collectors.joining(", "));
        filas.add(fila(
                "Fecha", fechaResumenLeche,
                "Origen", "Inventario de leche",
                "Producto/Concepto", "Total leche producida",
                "Cantidad", resumenLeche.litrosTotales(),
                "Unidad", "LT",
                "Observaciones", "",
                "Responsable", responsableResumenLeche));
        for (InventarioLeche area : resumenLeche.areas()) {
            filas.add(fila(
                    "Fecha", fechaResumenLeche,
                    "Origen", "Inventario de leche",
                    "Producto/Concepto", area.etiqueta() + " · asignados",
                    "Cantidad", area.asignado(),
                    "Unidad", "LT",
                    "Observaciones", "",
                    "Responsable", responsableResumenLeche));
            filas.add(fila(
                    "Fecha", fechaResumenLeche,
                    "Origen", "Inventario de leche",
                    "Producto/Concepto", area.etiqueta() + " · utilizados",
                    "Cantidad", area.utilizado(),
                    "Unidad", "LT",
                    "Observaciones", "",
                    "Responsable", responsableResumenLeche));
        }
        totales.put("Litros totales producidos", resumenLeche.litrosTotales());
        totales.put("Litros asignados", resumenLeche.litrosAsignados());
        totales.put("Litros utilizados", resumenLeche.litrosUtilizados());
        resumenLeche.areas().forEach(area ->
                totales.put(area.etiqueta() + " asignados", area.asignado()));
        resumenLeche.areas().forEach(area ->
                totales.put(area.etiqueta() + " utilizados", area.utilizado()));

        for (ProduccionLeche produccion : produccionesPeriodo) {
            agregarProduccionLeche(filas, produccion, "Terneros", produccion.getLitrosTerneros());
            agregarProduccionLeche(filas, produccion, "Venta directa", produccion.getVentaDirecta());
            agregarProduccionLeche(filas, produccion, "Consumo cocina", produccion.getConsumoCocina());
            agregarProduccionLeche(filas, produccion, "Elaboración de quesos",
                    produccion.getElaboracionQuesos());
            agregarProduccionLeche(filas, produccion, "Elaboración de dulce de leche",
                    produccion.getElaboracionDulceDeLeche());
            agregarProduccionLeche(filas, produccion, "Elaboración de quark",
                    produccion.getElaboracionQuark());
        }

        for (Elaboracion elaboracion : elaboracionRepository.findAll()) {
            if (!incluida(elaboracion.getFechaElaboracion(), desde, hasta)) {
                continue;
            }
            BigDecimal cantidad = ceroSiNulo(elaboracion.getCantidadProducida());
            filas.add(fila(
                    "Fecha", elaboracion.getFechaElaboracion(),
                    "Origen", "Elaboración",
                    "Producto/Concepto", nombreProducto(elaboracion.getProductoElaborado()),
                    "Cantidad", cantidad,
                    "Unidad", unidadProducto(elaboracion.getProductoElaborado()),
                    "Observaciones", elaboracion.getObservaciones(),
                    "Responsable", nombreResponsable(elaboracion.getUsuario())));
        }

        for (Cosecha cosecha : cosechaRepository.findAll()) {
            if (!incluida(cosecha.getFechaCosecha(), desde, hasta)) {
                continue;
            }
            BigDecimal cantidad = ceroSiNulo(cosecha.getCantidadCosecha());
            filas.add(fila(
                    "Fecha", cosecha.getFechaCosecha(),
                    "Origen", "Cosecha",
                    "Producto/Concepto", nombreProducto(cosecha.getProductoCosecha()),
                    "Cantidad", cantidad,
                    "Unidad", unidadProducto(cosecha.getProductoCosecha()),
                    "Observaciones", cosecha.getObservaciones(),
                    "Responsable", nombreResponsable(cosecha.getUsuario())));
        }

        List<Map<String, Object>> detalle = new ArrayList<>(filas.subList(filasResumenLeche, filas.size()));
        detalle.sort((a, b) -> compararFechas(a.get("Fecha"), b.get("Fecha")));
        filas = new ArrayList<>(filas.subList(0, filasResumenLeche));
        filas.addAll(detalle);
        totales.put("Registros", BigDecimal.valueOf(detalle.size()));
        return respuesta("PRODUCCION", "Reporte de producción", desde, hasta, columnas, filas, totales);
    }

    private void agregarProduccionLeche(
            List<Map<String, Object>> filas,
            ProduccionLeche produccion,
            String concepto,
            BigDecimal valor
    ) {
        BigDecimal cantidad = ceroSiNulo(valor);
        if (cantidad.signum() == 0) {
            return;
        }
        filas.add(fila(
                "Fecha", produccion.getFecha(),
                "Origen", "Producción de leche",
                "Producto/Concepto", concepto,
                "Cantidad", cantidad,
                "Unidad", "LT",
                "Observaciones", produccion.getComentario(),
                "Responsable", nombreResponsable(produccion.getUsuario())));
    }

    private ReporteResponse reporteStock(LocalDate desde, LocalDate hasta) {
        List<String> columnas = List.of(
                "Producto", "Tipo", "Unidad", "Stock actual", "Stock mínimo",
                "Entradas período", "Salidas período");
        Map<Integer, BigDecimal[]> movimientosPorProducto = new LinkedHashMap<>();
        for (MovimientoStock movimiento : movimientoStockRepository.findAll()) {
            LocalDate fecha = movimiento.getFechaMov() == null
                    ? null : movimiento.getFechaMov().toLocalDate();
            if (!incluida(fecha, desde, hasta) || movimiento.getProductoMov() == null) {
                continue;
            }
            Integer idProducto = movimiento.getProductoMov().getIdProducto();
            BigDecimal[] cantidades = movimientosPorProducto.computeIfAbsent(
                    idProducto, id -> new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
            if ("ENTRADA".equalsIgnoreCase(movimiento.getTipoMov())) {
                cantidades[0] = cantidades[0].add(ceroSiNulo(movimiento.getCantidadMov()));
            } else if ("SALIDA".equalsIgnoreCase(movimiento.getTipoMov())) {
                cantidades[1] = cantidades[1].add(ceroSiNulo(movimiento.getCantidadMov()));
            }
        }

        List<Map<String, Object>> filas = new ArrayList<>();
        Map<String, BigDecimal> totales = new LinkedHashMap<>();
        for (Producto producto : productoRepository.findAll()) {
            BigDecimal stock = ceroSiNulo(producto.getStockActual());
            BigDecimal[] movimientos = movimientosPorProducto.getOrDefault(
                    producto.getIdProducto(), new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
            filas.add(fila(
                    "Producto", nombreProducto(producto),
                    "Tipo", producto.getTipo() == null ? "" : producto.getTipo().name(),
                    "Unidad", unidadProducto(producto),
                    "Stock actual", stock,
                    "Stock mínimo", ceroSiNulo(producto.getStockMinimo()),
                    "Entradas período", movimientos[0],
                    "Salidas período", movimientos[1]));
        }
        totales.put("Productos en reporte", BigDecimal.valueOf(filas.size()));
        return respuesta("STOCK", "Reporte de stock", desde, hasta, columnas, filas, totales);
    }

    private ReporteResponse reporteVentas(LocalDate desde, LocalDate hasta) {
        List<String> columnas = List.of("Producto", "Unidad", "Cantidad vendida", "Ingresos totales");
        Map<Integer, VentaProductoResumen> ventasPorProducto = new LinkedHashMap<>();
        List<Map<String, Object>> filasDetalle = new ArrayList<>();
        Map<String, BigDecimal> totales = new LinkedHashMap<>();
        totales.put("Cantidad vendida", BigDecimal.ZERO);
        totales.put("Total vendido", BigDecimal.ZERO);

        for (Venta venta : ventaRepository.findAllWithDetails()) {
            if (!incluida(venta.getFechaVenta(), desde, hasta)) {
                continue;
            }
            for (DetalleVenta detalle : venta.getDetalleVenta()) {
                BigDecimal cantidad = ceroSiNulo(detalle.getCantidadDV());
                BigDecimal subtotal = detalle.getSubtotal() == null
                        ? ceroSiNulo(detalle.getPrecioUnitario()).multiply(cantidad)
                        : detalle.getSubtotal();
                Producto producto = detalle.getProductoVendido();
                Integer idProducto = producto == null
                        ? -detalle.getIdDetalleVenta()
                        : producto.getIdProducto();
                VentaProductoResumen resumen = ventasPorProducto.computeIfAbsent(
                        idProducto,
                        id -> new VentaProductoResumen(
                                producto == null
                                        ? "Producto no identificado"
                                        : nombreProducto(producto),
                                unidadProducto(producto)));
                resumen.agregar(cantidad, subtotal);
                filasDetalle.add(fila(
                        "Fecha", venta.getFechaVenta(),
                        "Venta", venta.getIdVenta(),
                        "Producto", resumen.producto(),
                        "Unidad", unidadProducto(producto),
                        "Cantidad", cantidad,
                        "Precio unitario", detalle.getPrecioUnitario(),
                        "Subtotal", subtotal,
                        "Usuario", nombreUsuario(venta.getUsuario())));
                sumar(totales, "Cantidad vendida", cantidad);
                sumar(totales, "Total vendido", subtotal);
            }
        }
        List<Map<String, Object>> filas = ventasPorProducto.values().stream()
                .sorted((primero, segundo) -> primero.producto().compareToIgnoreCase(segundo.producto()))
                .map(resumen -> fila(
                        "Producto", resumen.producto(),
                        "Unidad", resumen.unidad(),
                        "Cantidad vendida", resumen.cantidadVendida(),
                        "Ingresos totales", resumen.ingresosTotales()))
                .toList();
        totales.put("Productos vendidos", BigDecimal.valueOf(filas.size()));
        filasDetalle.sort((primera, segunda) -> {
            int porProducto = ((String) primera.get("Producto"))
                    .compareToIgnoreCase((String) segunda.get("Producto"));
            return porProducto != 0
                    ? porProducto
                    : compararFechas(primera.get("Fecha"), segunda.get("Fecha"));
        });
        ReporteResponse respuesta = respuesta(
                "VENTAS", "Reporte de ventas", desde, hasta, columnas, filas, totales);
        respuesta.setFilasDetalle(filasDetalle);
        return respuesta;
    }

    private ReporteResponse reporteInsumos(LocalDate desde, LocalDate hasta) {
        List<String> columnas = List.of(
                "Fecha", "Elaboración", "Insumo", "Cantidad utilizada", "Unidad", "Usuario");
        List<Map<String, Object>> filas = new ArrayList<>();
        Map<String, BigDecimal> totales = new LinkedHashMap<>();
        BigDecimal insumosUtilizados = BigDecimal.ZERO;

        for (Elaboracion elaboracion : elaboracionRepository.findAll()) {
            if (!incluida(elaboracion.getFechaElaboracion(), desde, hasta)
                    || elaboracion.getDetalles() == null) {
                continue;
            }
            for (DetalleElaboracion detalle : elaboracion.getDetalles()) {
                BigDecimal cantidad = ceroSiNulo(detalle.getCantidadUtilizada());
                filas.add(fila(
                        "Fecha", elaboracion.getFechaElaboracion(),
                        "Elaboración", nombreProducto(elaboracion.getProductoElaborado()),
                        "Insumo", nombreProducto(detalle.getInsumoUtilizado()),
                        "Cantidad utilizada", cantidad,
                        "Unidad", unidadProducto(detalle.getInsumoUtilizado()),
                        "Usuario", nombreUsuario(elaboracion.getUsuario())));
                insumosUtilizados = insumosUtilizados.add(BigDecimal.ONE);
            }
        }
        totales.put("Insumos utilizados", insumosUtilizados);
        filas.sort((a, b) -> compararFechas(a.get("Fecha"), b.get("Fecha")));
        return respuesta("INSUMOS", "Reporte de insumos utilizados", desde, hasta, columnas, filas, totales);
    }

    private ReporteResponse respuesta(
            String tipo,
            String titulo,
            LocalDate desde,
            LocalDate hasta,
            List<String> columnas,
            List<Map<String, Object>> filas,
            Map<String, BigDecimal> totales
    ) {
        return new ReporteResponse(tipo, titulo, desde, hasta, columnas, filas, totales);
    }

    private boolean incluida(LocalDate fecha, LocalDate desde, LocalDate hasta) {
        return fecha != null
                && (desde == null || !fecha.isBefore(desde))
                && (hasta == null || !fecha.isAfter(hasta));
    }

    private Map<String, Object> fila(Object... clavesValores) {
        Map<String, Object> fila = new LinkedHashMap<>();
        for (int i = 0; i < clavesValores.length; i += 2) {
            fila.put((String) clavesValores[i], clavesValores[i + 1]);
        }
        return fila;
    }

    private void sumar(Map<String, BigDecimal> totales, String clave, BigDecimal cantidad) {
        totales.merge(clave, ceroSiNulo(cantidad), BigDecimal::add);
    }

    private BigDecimal ceroSiNulo(BigDecimal valor) {
        return valor == null ? BigDecimal.ZERO : valor;
    }

    private String nombreProducto(Producto producto) {
        return producto == null || producto.getNombreProducto() == null
                ? "" : producto.getNombreProducto();
    }

    private String unidadProducto(Producto producto) {
        return producto == null || producto.getUnidadMedida() == null
                ? "" : producto.getUnidadMedida().name();
    }

    private String nombreUsuario(com.centroemmanuel.entity.Usuario usuario) {
        if (usuario == null) {
            return "";
        }
        String nombre = usuario.getNombreUsuario();
        return nombre == null ? "" : nombre;
    }

    private String nombreResponsable(com.centroemmanuel.entity.Usuario usuario) {
        if (usuario == null) {
            return "";
        }
        String nombreCompleto = java.util.stream.Stream.of(usuario.getNombre(), usuario.getApellido())
                .filter(parte -> parte != null && !parte.isBlank())
                .map(String::trim)
                .collect(java.util.stream.Collectors.joining(" "));
        return nombreCompleto.isBlank() ? nombreUsuario(usuario) : nombreCompleto;
    }

    private int compararFechas(Object primera, Object segunda) {
        if (primera instanceof LocalDate fechaPrimera && segunda instanceof LocalDate fechaSegunda) {
            return fechaPrimera.compareTo(fechaSegunda);
        }
        return 0;
    }

    private static class VentaProductoResumen {
        private final String producto;
        private final String unidad;
        private BigDecimal cantidadVendida = BigDecimal.ZERO;
        private BigDecimal ingresosTotales = BigDecimal.ZERO;

        private VentaProductoResumen(String producto, String unidad) {
            this.producto = producto;
            this.unidad = unidad;
        }

        private void agregar(BigDecimal cantidad, BigDecimal ingresos) {
            cantidadVendida = cantidadVendida.add(cantidad);
            ingresosTotales = ingresosTotales.add(ingresos);
        }

        private String producto() {
            return producto;
        }

        private String unidad() {
            return unidad;
        }

        private BigDecimal cantidadVendida() {
            return cantidadVendida;
        }

        private BigDecimal ingresosTotales() {
            return ingresosTotales;
        }
    }
}
