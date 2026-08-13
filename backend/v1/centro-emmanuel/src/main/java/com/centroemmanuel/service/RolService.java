// package com.centroemmanuel.service;

// import java.util.List;

// import org.springframework.stereotype.Service;

// import com.centroemmanuel.entity.Rol;
// import com.centroemmanuel.repository.RolRepository;

// @Service
// public class RolService {

//     private final RolRepository rolRepository;

//     public RolService(RolRepository rolRepository) {
//         this.rolRepository = rolRepository;
//     }

//     // Listar todos los roles
//     public List<Rol> listarTodos() {

//         return rolRepository.findAll();

//     }

//     // Buscar rol por ID
//     public Rol buscarPorId(int id) {

//         return rolRepository.findById(id)
//                 .orElse(null);

//     }

//     // Crear rol
//     public Rol crear(Rol rol) {

//         return rolRepository.save(rol);

//     }

//     // Modificar rol


//     // Modificar rol
// public Rol modificar(int id, Rol rol) {

//     Rol rolExistente = rolRepository.findById(id)
//             .orElse(null);

//     if (rolExistente == null) {
//         return null;
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

//     return rolRepository.save(rolExistente);
// }
//     // public Rol modificar(int id, Rol rol) {

//     //     Rol rolExistente = rolRepository.findById(id)
//     //             .orElse(null);

//     //     if (rolExistente == null) {
//     //         return null;
//     //     }

//     //     rolExistente.setNombreRol(rol.getNombreRol());
//     //     rolExistente.setDescripcion(rol.getDescripcion());

//     //     return rolRepository.save(rolExistente);

//     // }

//     // Eliminar rol
//     public boolean eliminar(int id) {

//         if (!rolRepository.existsById(id)) {
//             return false;
//         }

//         rolRepository.deleteById(id);

//         return true;

//     }

// }



package com.centroemmanuel.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.centroemmanuel.entity.Rol;
import com.centroemmanuel.repository.RolRepository;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }


    // Listar todos los roles
    public List<Rol> listarTodos() {

        return rolRepository.findAll();

    }


    // Buscar rol por ID
    public Rol buscarPorId(int id) {

        return rolRepository.findById(id)
                .orElse(null);

    }


    // Crear rol
    public Rol crear(Rol rol) {

        return rolRepository.save(rol);

    }


    // Modificar rol
    public Rol modificar(int id, Rol rol) {

        Rol rolExistente = rolRepository.findById(id)
                .orElse(null);

        if (rolExistente == null) {
            return null;
        }

        rolExistente.setNombreRol(
                rol.getNombreRol()
        );

        rolExistente.setDescripcion(
                rol.getDescripcion()
        );

        rolExistente.setPermisos(
                rol.getPermisos()
        );

        return rolRepository.save(rolExistente);

    }


    // Eliminar rol
    public boolean eliminar(int id) {

        if (!rolRepository.existsById(id)) {
            return false;
        }

        rolRepository.deleteById(id);

        return true;

    }

}