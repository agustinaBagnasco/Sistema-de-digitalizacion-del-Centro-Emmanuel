package com.centroemmanuel.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.entity.Permiso;
import com.centroemmanuel.service.PermisoService;


@RestController
@RequestMapping("/api/permisos")
@CrossOrigin(origins = "http://localhost:5173")
public class PermisoController {


    private final PermisoService permisoService;


    public PermisoController(PermisoService permisoService) {
        this.permisoService = permisoService;
    }


    // GET /api/permisos
    @GetMapping
    public List<Permiso> listar() {

        return permisoService.listarTodos();

    }


    // GET /api/permisos/1
    @GetMapping("/{id}")
    public Permiso buscar(@PathVariable int id) {

        return permisoService.buscarPorId(id);

    }


    // POST /api/permisos
    @PostMapping
    public Permiso crear(@RequestBody Permiso permiso) {

        return permisoService.guardar(permiso);

    }


    // PUT /api/permisos/1
    @PutMapping("/{id}")
    public Permiso modificar(
            @PathVariable int id,
            @RequestBody Permiso permiso) {

        permiso.setIdPermiso(id);

        return permisoService.guardar(permiso);

    }


    // DELETE /api/permisos/1
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable int id) {

        permisoService.eliminar(id);

    }
}