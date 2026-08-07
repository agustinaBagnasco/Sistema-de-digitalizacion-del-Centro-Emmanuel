package com.centroemmanuel.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.repository.UsuarioRepository;


@Service
public class UsuarioService {


    private final UsuarioRepository usuarioRepository;


    public UsuarioService(UsuarioRepository usuarioRepository){
        this.usuarioRepository = usuarioRepository;
    }


    // Listar usuarios
    public List<Usuario> listarTodos(){

        return usuarioRepository.findAll();

    }


    // Buscar por id
    public Usuario buscarPorId(int id){

        return usuarioRepository.findById(id)
                .orElse(null);

    }


    // Crear o modificar usuario
    public Usuario guardar(Usuario usuario){

        return usuarioRepository.save(usuario);

    }


    // Eliminar usuario
    public void eliminar(int id){

        usuarioRepository.deleteById(id);

    }

}