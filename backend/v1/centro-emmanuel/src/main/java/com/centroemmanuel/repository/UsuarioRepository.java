package com.centroemmanuel.repository;
import java.util.Optional;
import com.centroemmanuel.entity.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    @EntityGraph(attributePaths = "permisos")
    @Override
    java.util.List<Usuario> findAll();

    @EntityGraph(attributePaths = "permisos")
    @Override
    Optional<Usuario> findById(Integer id);

    boolean existsByNombreUsuario(String nombreUsuario);

    @EntityGraph(attributePaths = "permisos")
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    Optional<Usuario> findByIdUsuario(int idUsuario);
}
