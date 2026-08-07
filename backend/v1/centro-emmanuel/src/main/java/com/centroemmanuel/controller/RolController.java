package com.centroemmanuel.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.entity.Rol;
import com.centroemmanuel.service.RolService;


@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:5173")
public class RolController {


    private final RolService rolService;


    public RolController(RolService rolService){
        this.rolService = rolService;
    }


    @GetMapping
    public List<Rol> listar(){

        return rolService.listarTodos();

    }


    @GetMapping("/{id}")
    public Rol buscar(@PathVariable int id){

        return rolService.buscarPorId(id);

    }


    @PostMapping
    public Rol crear(@RequestBody Rol rol){

        return rolService.guardar(rol);

    }


    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable int id){

        rolService.eliminar(id);

    }
}