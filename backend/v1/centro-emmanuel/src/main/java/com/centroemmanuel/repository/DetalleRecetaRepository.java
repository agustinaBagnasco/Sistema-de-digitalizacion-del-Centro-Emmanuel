package com.centroemmanuel.repository;

import com.centroemmanuel.entity.DetalleReceta;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleRecetaRepository extends JpaRepository<DetalleReceta, Integer> {

}