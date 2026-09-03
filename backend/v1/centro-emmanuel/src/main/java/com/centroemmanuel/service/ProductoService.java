package com.centroemmanuel.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.repository.ProductoRepository;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
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
    public Producto guardar(Producto producto) {
            if (producto.getStockActual() == null) {
            producto.setStockActual(0.0);
        }

        if (producto.getStockMinimo() == null) {
            producto.setStockMinimo(0.0);
        }
        return productoRepository.save(producto);
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

            return productoRepository.save(producto);
        }

        return null;
    }

    // Eliminar producto
    public void eliminar(Integer id) {

        productoRepository.deleteById(id);

    }
}