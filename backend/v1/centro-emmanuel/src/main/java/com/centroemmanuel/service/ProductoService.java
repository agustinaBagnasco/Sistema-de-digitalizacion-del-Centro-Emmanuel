package com.centroemmanuel.service;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.enums.Tipo;
import com.centroemmanuel.repository.CosechaRepository;
import com.centroemmanuel.repository.DetalleElaboracionRepository;
import com.centroemmanuel.repository.DetalleVentaRepository;
import com.centroemmanuel.repository.ElaboracionRepository;
import com.centroemmanuel.repository.MovimientoStockRepository;
import com.centroemmanuel.repository.ProductoRepository;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final StockService stockService;
    private final MovimientoStockRepository movimientoStockRepository;
    private final ElaboracionRepository elaboracionRepository;
    private final DetalleElaboracionRepository detalleElaboracionRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final CosechaRepository cosechaRepository;

    public ProductoService(
            ProductoRepository productoRepository,
            StockService stockService,
            MovimientoStockRepository movimientoStockRepository,
            ElaboracionRepository elaboracionRepository,
            DetalleElaboracionRepository detalleElaboracionRepository,
            DetalleVentaRepository detalleVentaRepository,
            CosechaRepository cosechaRepository) {
        this.productoRepository = productoRepository;
        this.stockService = stockService;
        this.movimientoStockRepository = movimientoStockRepository;
        this.elaboracionRepository = elaboracionRepository;
        this.detalleElaboracionRepository = detalleElaboracionRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.cosechaRepository = cosechaRepository;
    }

    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    public Optional<Producto> buscarPorId(Integer id) {
        return productoRepository.findById(id);
    }

    @Transactional
    public Producto guardar(Producto producto, Integer idUsuario) {
        validarPesoHorma(producto.getPesoHorma());
        BigDecimal stockInicial = producto.getStockActual() == null ? BigDecimal.ZERO : producto.getStockActual();
        if (stockInicial.signum() < 0) {
            throw new IllegalArgumentException("El stock inicial no puede ser negativo.");
        }
        if (stockInicial.signum() > 0 && idUsuario == null) {
            throw new IllegalArgumentException("Se requiere el usuario para registrar el stock inicial.");
        }

        producto.setStockActual(BigDecimal.ZERO);
        if (producto.getStockMinimo() == null) {
            producto.setStockMinimo(BigDecimal.ZERO);
        }
        normalizarInsumo(producto);
        Producto guardado = productoRepository.save(producto);
        stockService.registrarEntrada(guardado, stockInicial, idUsuario, "Stock inicial");
        return guardado;
    }

    public Producto actualizar(Integer id, Producto datos) {
        validarPesoHorma(datos.getPesoHorma());

        Optional<Producto> existente =
                productoRepository.findById(id);

        if (existente.isPresent()) {

            Producto producto = existente.get();

            producto.setNombreProducto(
                    datos.getNombreProducto()
            );

            producto.setDescripcion(
                    datos.getDescripcion()
            );

            producto.setStockActual(
                    datos.getStockActual()
            );

            producto.setStockMinimo(
                    datos.getStockMinimo()
            );
            producto.setCosto(
                datos.getCosto()
            );
            producto.setPesoHorma(datos.getPesoHorma());
            producto.setProductoResultado(datos.getProductoResultado());
            producto.setActivo(
                    datos.isActivo()
            );

            producto.setCategoria(
                    datos.getCategoria()
            );

            producto.setUnidadMedida(
                    datos.getUnidadMedida()
            );
            producto.setTipo(
                datos.getTipo()
                );
            normalizarInsumo(producto);

            return productoRepository.save(producto);
        }

        return null;
    }

    private void normalizarInsumo(Producto producto) {
        if (producto.getTipo() == Tipo.INSUMO) {
            producto.setCosto(null);
        }
    }

    private void validarPesoHorma(BigDecimal pesoHorma) {
        if (pesoHorma != null && pesoHorma.signum() < 0) {
            throw new IllegalArgumentException("El peso de la horma no puede ser negativo.");
        }
    }

    public void eliminar(Integer id) {
        if (productoRepository.existsByProductoResultado_IdProducto(id)
                || movimientoStockRepository.existsByProductoMov_IdProducto(id)
                || elaboracionRepository.existsByProductoElaborado_IdProducto(id)
                || elaboracionRepository.existsByProductoElaborado1kg_IdProducto(id)
                || elaboracionRepository.existsByProductoElaborado420g_IdProducto(id)
                || detalleElaboracionRepository.existsByInsumoUtilizado_IdProducto(id)
                || detalleVentaRepository.existsByProductoVendido_IdProducto(id)
                || cosechaRepository.existsByProductoCosecha_IdProducto(id)) {
            throw new IllegalStateException(
                    "No se puede eliminar este producto porque tiene movimientos o registros asociados. "
                            + "Desactívelo para conservar el historial.");
        }
        try {
            productoRepository.deleteById(id);
        } catch (DataIntegrityViolationException error) {
            throw new IllegalStateException(
                    "No se puede eliminar este producto porque tiene movimientos o registros asociados. "
                            + "Desactívelo para conservar el historial.");
        }
    }
}