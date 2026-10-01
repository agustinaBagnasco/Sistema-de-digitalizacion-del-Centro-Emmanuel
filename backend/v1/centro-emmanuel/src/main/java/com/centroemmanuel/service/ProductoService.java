package com.centroemmanuel.service;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.enums.Tipo;
import com.centroemmanuel.repository.ProductoRepository;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final StockService stockService;

    public ProductoService(ProductoRepository productoRepository, StockService stockService) {
        this.productoRepository = productoRepository;
        this.stockService = stockService;
    }

    // Listar productos
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    // Buscar producto por ID
    public Optional<Producto> buscarPorId(Integer id) {
        return productoRepository.findById(id);
    }

    // Guardar producto
    @Transactional
    public Producto guardar(Producto producto, Integer idUsuario) {
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

    // Actualizar producto
    public Producto actualizar(Integer id, Producto datos) {

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

    // Eliminar producto
    public void eliminar(Integer id) {

        productoRepository.deleteById(id);

    }
}