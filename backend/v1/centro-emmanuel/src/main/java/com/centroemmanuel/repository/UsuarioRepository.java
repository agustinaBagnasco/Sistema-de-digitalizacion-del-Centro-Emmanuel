package com.centroemmanuel.repository;
import java.util.Optional;
import com.centroemmanuel.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    boolean existsByNombreUsuario(String nombreUsuario);

     Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    Optional<Usuario> findByIdUsuario(int idUsuario);
}
