package com.centroemmanuel.repository;

import com.centroemmanuel.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
	Optional<Producto> findByNombreProductoIgnoreCase(String nombreProducto);
	List<Producto> findAllByNombreProductoIgnoreCase(String nombreProducto);
	boolean existsByProductoResultado_IdProducto(Integer idProducto);
}
