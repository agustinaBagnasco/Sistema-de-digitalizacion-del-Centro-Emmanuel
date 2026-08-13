package com.centroemmanuel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.centroemmanuel.entity.Rol;
import com.centroemmanuel.service.RolService;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:5173")
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    // GET /api/roles
    @GetMapping
    public ResponseEntity<List<Rol>> listar() {

        return ResponseEntity.ok(
                rolService.listarTodos()
        );
    }

    // GET /api/roles/1
    @GetMapping("/{id}")
    public ResponseEntity<Rol> buscar(@PathVariable int id) {

        Rol rol = rolService.buscarPorId(id);

        if (rol == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(rol);
    }


   
    // POST /api/roles
    @PostMapping
    public ResponseEntity<Rol> crear(
            @RequestBody Rol rol) {

        Rol nuevoRol = rolService.crear(rol);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevoRol);
    }

    // PUT /api/roles/1

@PutMapping("/{id}")
public ResponseEntity<Rol> modificar(
        @PathVariable int id,
        @RequestBody Rol rol) {

    Rol rolModificado = rolService.modificar(id, rol);

    if (rolModificado == null) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(rolModificado);
}


//  @PutMapping("/{id}")
// public ResponseEntity<Rol> modificar(
//         @PathVariable int id,
//         @RequestBody Rol rol) {

//     Rol rolExistente = rolService.buscarPorId(id);

//     if (rolExistente == null) {
//         return ResponseEntity.notFound().build();
//     }

//     rolExistente.setNombreRol(
//             rol.getNombreRol()
//     );

//     rolExistente.setDescripcion(
//             rol.getDescripcion()
//     );

//     rolExistente.setPermisos(
//             rol.getPermisos()
//     );

//     Rol rolModificado =
//             rolService.guardar(rolExistente);

//     return ResponseEntity.ok(rolModificado);
// }




    // DELETE /api/roles/1
    @DeleteMapping("/{id}")
public ResponseEntity<Void> eliminar(
        @PathVariable int id) {

    boolean eliminado = rolService.eliminar(id);

    if (!eliminado) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.noContent().build();
}
}