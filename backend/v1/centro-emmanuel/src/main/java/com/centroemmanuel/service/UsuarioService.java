package com.centroemmanuel.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.centroemmanuel.entity.Permiso;
import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.repository.PermisoRepository;
import com.centroemmanuel.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PermisoRepository permisoRepository;

    public UsuarioService(UsuarioRepository pUsuarioRepository, PermisoRepository permisoRepository) {
        this.usuarioRepository = pUsuarioRepository;
        this.permisoRepository = permisoRepository;
    }

    public boolean existeUsuario(String pUsername) {
        return usuarioRepository.existsByNombreUsuario(pUsername);
    }

    public Usuario getUsuarioByUsername(String pUsername) {
        return usuarioRepository
                .findByNombreUsuario(pUsername)
                .orElse(null);
    }

    public Usuario getUsuarioById(int idUsuario) {
        return usuarioRepository
                .findByIdUsuario(idUsuario)
                .orElse(null);
    }

    public boolean crearUsuario(
            String nombreUsuario,
            String nombre,
            String apellido,
            String clave,
            String email) {

        if (existeUsuario(nombreUsuario)) {
            return false;
        }

        Usuario nuevoUsuario = new Usuario(
                nombreUsuario,
                nombre,
                apellido,
                clave,
                email
        );

        usuarioRepository.save(nuevoUsuario);
        return true;
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(int id) {
        return usuarioRepository.findById(id);
    }

    public Usuario crear(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario modificar(int id, Usuario datos) {

        Optional<Usuario> resultado =
                usuarioRepository.findById(id);

        if (resultado.isEmpty()) {
            return null;
        }

        Usuario usuario = resultado.get();

        usuario.setNombreUsuario(datos.getNombreUsuario());
        usuario.setNombre(datos.getNombre());
        usuario.setApellido(datos.getApellido());
        if (datos.getClave() != null && !datos.getClave().isBlank()) {
            usuario.setClave(datos.getClave());
        }
        usuario.setEmail(datos.getEmail());
        usuario.setActivo(datos.isActivo());

        if (datos.getPermisos() != null) {
            List<Integer> permisoIds = datos.getPermisos().stream()
                    .map(Permiso::getIdPermiso)
                    .distinct()
                    .collect(Collectors.toList());
            List<Permiso> permisos = permisoRepository.findAllById(permisoIds);
            if (permisos.size() != permisoIds.size()) {
                throw new IllegalArgumentException("Uno o más permisos seleccionados no existen.");
            }
            usuario.setPermisos(permisos);
        }

        return usuarioRepository.save(usuario);
    }

    public boolean eliminar(int id) {

        if (!usuarioRepository.existsById(id)) {
            return false;
        }

        usuarioRepository.deleteById(id);
        return true;
    }
}