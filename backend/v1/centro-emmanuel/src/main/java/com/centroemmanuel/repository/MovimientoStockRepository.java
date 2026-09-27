package com.centroemmanuel.repository;

import com.centroemmanuel.entity.MovimientoStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoStockRepository extends JpaRepository<MovimientoStock, Integer> {
	List<MovimientoStock> findByProductoMovIdProducto(Integer idProducto);
}
