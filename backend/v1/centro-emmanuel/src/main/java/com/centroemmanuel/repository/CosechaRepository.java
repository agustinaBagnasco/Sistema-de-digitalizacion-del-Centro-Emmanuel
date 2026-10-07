package com.centroemmanuel.repository;

import com.centroemmanuel.entity.Cosecha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CosechaRepository extends JpaRepository<Cosecha, Integer> {
    boolean existsByProductoCosecha_IdProducto(Integer idProducto);
}
