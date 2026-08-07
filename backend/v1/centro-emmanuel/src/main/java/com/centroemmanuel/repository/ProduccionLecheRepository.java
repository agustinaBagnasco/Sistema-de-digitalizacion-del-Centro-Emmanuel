package com.centroemmanuel.repository;

import com.centroemmanuel.entity.ProduccionLeche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduccionLecheRepository extends JpaRepository<ProduccionLeche, Integer> {
}
