package com.centroemmanuel.repository;

import com.centroemmanuel.entity.Elaboracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElaboracionRepository extends JpaRepository<Elaboracion, Integer> {
    boolean existsByProductoElaborado_IdProducto(Integer idProducto);
    boolean existsByProductoElaborado1kg_IdProducto(Integer idProducto);
    boolean existsByProductoElaborado420g_IdProducto(Integer idProducto);
}
 