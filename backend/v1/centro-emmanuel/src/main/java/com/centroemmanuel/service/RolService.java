package com.centroemmanuel.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.centroemmanuel.entity.Rol;
import com.centroemmanuel.repository.RolRepository;


@Service
public class RolService {


    private final RolRepository rolRepository;


    public RolService(RolRepository rolRepository){
        this.rolRepository = rolRepository;
    }


    public List<Rol> listarTodos(){

        return rolRepository.findAll();

    }


    public Rol buscarPorId(int id){

        return rolRepository.findById(id)
                .orElse(null);

    }


    public Rol guardar(Rol rol){

        return rolRepository.save(rol);

    }


    public void eliminar(int id){

        rolRepository.deleteById(id);

    }

}


