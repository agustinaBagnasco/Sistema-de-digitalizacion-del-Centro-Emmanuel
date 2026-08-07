package com.centroemmanuel.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.service.UsuarioService;


@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {


    private final UsuarioService usuarioService;


    public UsuarioController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }


    // GET /api/usuarios
    @GetMapping
    public List<Usuario> listar(){

        return usuarioService.listarTodos();

    }


    // GET /api/usuarios/1
    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable int id){

        return usuarioService.buscarPorId(id);

    }


    // POST /api/usuarios
    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario){

        return usuarioService.guardar(usuario);

    }


    // PUT /api/usuarios/1
    @PutMapping("/{id}")
    public Usuario modificar(
            @PathVariable int id,
            @RequestBody Usuario usuario){

        usuario.setIdUsuario(id);

        return usuarioService.guardar(usuario);

    }


    // DELETE /api/usuarios/1
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable int id){

        usuarioService.eliminar(id);

    }

}