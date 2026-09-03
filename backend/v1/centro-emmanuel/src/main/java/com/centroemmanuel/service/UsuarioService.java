package com.centroemmanuel.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository pUsuarioRepository) {
        this.usuarioRepository = pUsuarioRepository;
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

    // =========================
    // CRUD
    // =========================

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(int id) {
        return usuarioRepository.findById(id);
    }

    public Usuario crear(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

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
        usuario.setClave(datos.getClave());
        usuario.setEmail(datos.getEmail());
        usuario.setActivo(datos.isActivo());

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