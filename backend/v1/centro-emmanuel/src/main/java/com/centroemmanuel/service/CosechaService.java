
package com.centroemmanuel.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.centroemmanuel.entity.Cosecha;
import com.centroemmanuel.repository.CosechaRepository;

@Service
public class CosechaService {

    private final CosechaRepository cosechaRepository;

    public CosechaService(CosechaRepository cosechaRepository) {
        this.cosechaRepository = cosechaRepository;
    }

    // Listar todas las cosechas
    public List<Cosecha> listar() {
        return cosechaRepository.findAll();
    }

    // Buscar una cosecha por ID
    public Optional<Cosecha> buscarPorId(Integer id) {
        return cosechaRepository.findById(id);
    }

    // Guardar una cosecha
    public Cosecha guardar(Cosecha cosecha) {
        return cosechaRepository.save(cosecha);
    }

    // Actualizar una cosecha
    public Cosecha actualizar(Integer id, Cosecha datos) {

        Optional<Cosecha> existente = cosechaRepository.findById(id);

        if (existente.isPresent()) {

            Cosecha cosecha = existente.get();

            cosecha.setProductoCosecha(datos.getProductoCosecha());
            cosecha.setCantidadCosecha(datos.getCantidadCosecha());
            cosecha.setObservaciones(datos.getObservaciones());
            cosecha.setUsuario(datos.getUsuario());

            return cosechaRepository.save(cosecha);
        }

        return null;
    }

    // Eliminar una cosecha
    public void eliminar(Integer id) {
        cosechaRepository.deleteById(id);
    }
}

