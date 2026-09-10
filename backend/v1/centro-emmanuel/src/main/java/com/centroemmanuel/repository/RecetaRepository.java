package com.centroemmanuel.repository;

import com.centroemmanuel.entity.Receta;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecetaRepository extends JpaRepository<Receta, Integer> {

}