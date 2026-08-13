package com.centroemmanuel.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;


    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }


    // =========================
    // LISTAR USUARIOS
    // =========================

    public List<Usuario> listarTodos() {

        return usuarioRepository.findAll();

    }


    // =========================
    // BUSCAR POR ID
    // =========================

    public Usuario buscarPorId(int id) {

        return usuarioRepository.findById(id)
                .orElse(null);

    }


    // =========================
    // CREAR USUARIO
    // =========================

    public Usuario crear(Usuario usuario) {

        return usuarioRepository.save(usuario);

    }


    // =========================
    // MODIFICAR USUARIO
    // =========================

    @Transactional
    public Usuario modificar(int id, Usuario usuario) {

        Usuario usuarioExistente =
                usuarioRepository.findById(id)
                        .orElse(null);


        if (usuarioExistente == null) {

            return null;

        }


        usuarioExistente.setNombreUsuario(
                usuario.getNombreUsuario()
        );

        usuarioExistente.setNombre(
                usuario.getNombre()
        );

        usuarioExistente.setApellido(
                usuario.getApellido()
        );

        usuarioExistente.setEmail(
                usuario.getEmail()
        );

        usuarioExistente.setActivo(
                usuario.isActivo()
        );


        // =========================
        // ACTUALIZAR ROLES
        // =========================

        usuarioExistente.getRoles().clear();

        if (usuario.getRoles() != null) {

            usuarioExistente
                    .getRoles()
                    .addAll(usuario.getRoles());

        }


        // =========================
        // ACTUALIZAR CLAVE
        // =========================

        // Solo modifica la clave si viene informada.

        if (usuario.getClave() != null
                && !usuario.getClave().isBlank()) {

            usuarioExistente.setClave(
                    usuario.getClave()
            );

        }


        return usuarioRepository.save(
                usuarioExistente
        );

    }


    // =========================
    // ELIMINAR USUARIO
    // =========================

    @Transactional
    public boolean eliminar(int id) {

        if (!usuarioRepository.existsById(id)) {

            return false;

        }

        usuarioRepository.deleteById(id);

        return true;

    }

}

