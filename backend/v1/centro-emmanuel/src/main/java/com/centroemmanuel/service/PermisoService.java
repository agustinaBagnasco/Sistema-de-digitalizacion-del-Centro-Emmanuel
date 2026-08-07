package com.centroemmanuel.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.centroemmanuel.entity.Permiso;
import com.centroemmanuel.repository.PermisoRepository;


@Service
public class PermisoService {

    private final PermisoRepository permisoRepository;


    public PermisoService(PermisoRepository permisoRepository) {
        this.permisoRepository = permisoRepository;
    }


    // Obtener todos los permisos
    public List<Permiso> listarTodos() {
        return permisoRepository.findAll();
    }


    // Buscar permiso por id
    public Permiso buscarPorId(int id) {

        return permisoRepository.findById(id)
                .orElse(null);

    }


    // Crear o modificar permiso
    public Permiso guardar(Permiso permiso) {

        return permisoRepository.save(permiso);

    }


    // Eliminar permiso
    public void eliminar(int id) {

        permisoRepository.deleteById(id);

    }
}