package com.centroemmanuel.service;

import com.centroemmanuel.dto.VentaRequest;
import com.centroemmanuel.entity.DetalleVenta;
import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.entity.Venta;
import com.centroemmanuel.enums.Categoria;
import com.centroemmanuel.enums.DestinoLeche;
import com.centroemmanuel.repository.ProductoRepository;
import com.centroemmanuel.repository.UsuarioRepository;
import com.centroemmanuel.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VentaService {
    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final StockService stockService;
    private final InventarioLecheService inventarioLecheService;

    public VentaService(VentaRepository ventaRepository,
                        ProductoRepository productoRepository,
                        UsuarioRepository usuarioRepository,
                        StockService stockService,
                        InventarioLecheService inventarioLecheService) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.stockService = stockService;
        this.inventarioLecheService = inventarioLecheService;
    }

    @Transactional
    public int importar(VentaRequest request) {
        if (request == null || request.getIdUsuario() == null
                || request.getVentas() == null || request.getVentas().isEmpty()) {
            throw new IllegalArgumentException("El archivo no contiene ventas para importar.");
        }

        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("El usuario de la sesión no existe."));

        List<VentaPreparada> ventasPreparadas = new ArrayList<>();
        Map<Integer, BigDecimal> cantidadesPorProducto = new HashMap<>();
        BigDecimal litrosLecheVendidos = BigDecimal.ZERO;
        for (int indice = 0; indice < request.getVentas().size(); indice++) {
            VentaRequest.VentaImportada fila = request.getVentas().get(indice);
            int numeroFila = indice + 2;
            validarFila(fila, indice);

                List<Producto> productosEncontrados = productoRepository
                    .findAllByNombreProductoIgnoreCase(fila.getConcepto().trim());
                if (productosEncontrados.isEmpty()) {
                throw new IllegalArgumentException(
                    "No existe un producto llamado '" + fila.getConcepto().trim() + "' (fila " + numeroFila + ").");
                }
                if (productosEncontrados.size() > 1) {
                String idsProductos = productosEncontrados.stream()
                    .map(producto -> producto.getIdProducto() + " (" + producto.getUnidadMedida() + ")")
                    .collect(Collectors.joining(", "));
                throw new IllegalArgumentException(
                    "Hay varios productos llamados '" + fila.getConcepto().trim()
                        + "': " + idsProductos + ". Deje un solo producto con ese nombre antes de importar.");
                }
                Producto producto = productosEncontrados.get(0);
                if (producto.getCategoria() == Categoria.LECHE) {
                    litrosLecheVendidos = litrosLecheVendidos.add(fila.getCantidad());
                }

            BigDecimal stockActual = producto.getStockActual() == null ? BigDecimal.ZERO : producto.getStockActual();
                BigDecimal cantidadAcumulada = cantidadesPorProducto.merge(
                    producto.getIdProducto(), fila.getCantidad(), BigDecimal::add);
                if (stockActual.compareTo(cantidadAcumulada) < 0) {
                throw new IllegalArgumentException(
                        "Stock insuficiente para '" + producto.getNombreProducto() + "' (fila " + numeroFila + ").");
            }

            ventasPreparadas.add(new VentaPreparada(fila, producto));
        }

        if (litrosLecheVendidos.signum() > 0) {
            inventarioLecheService.validarUso(DestinoLeche.VENTA_DIRECTA, litrosLecheVendidos);
        }

        for (VentaPreparada preparada : ventasPreparadas) {
            VentaRequest.VentaImportada fila = preparada.fila();
            Producto producto = preparada.producto();
            Venta venta = new Venta();
            venta.setFechaVenta(fila.getFecha());
            venta.setTotal(fila.getTotal());
            venta.setUsuario(usuario);

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(venta);
            detalle.setProductoVendido(producto);
            detalle.setCantidadDV(fila.getCantidad());
            detalle.setPrecioUnitario(fila.getUnitario());
            detalle.setSubtotal(fila.getTotal());
            venta.setDetalleVenta(List.of(detalle));

            boolean esLeche = producto.getCategoria() == Categoria.LECHE;
            stockService.descontar(
                    producto,
                    fila.getCantidad(),
                    usuario,
                    "Venta importada" + (esLeche ? " · destino: Venta directa" : ""),
                    esLeche ? DestinoLeche.VENTA_DIRECTA : null);
            ventaRepository.save(venta);
        }

        return ventasPreparadas.size();
    }

    private void validarFila(VentaRequest.VentaImportada fila, int indice) {
        if (fila == null || fila.getFecha() == null || fila.getFecha().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de la fila " + (indice + 2) + " no es válida.");
        }
        if (fila.getConcepto() == null || fila.getConcepto().trim().isEmpty()) {
            throw new IllegalArgumentException("El concepto de la fila " + (indice + 2) + " es obligatorio.");
        }
        if (fila.getCantidad() == null || fila.getCantidad().signum() <= 0
                || fila.getUnitario() == null || fila.getUnitario().compareTo(BigDecimal.ZERO) < 0
                || fila.getTotal() == null || fila.getTotal().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Los importes de la fila " + (indice + 2) + " no son válidos.");
        }
    }

    private record VentaPreparada(VentaRequest.VentaImportada fila, Producto producto) {}
}
