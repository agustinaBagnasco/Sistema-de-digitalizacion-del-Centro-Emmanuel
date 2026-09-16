package com.centroemmanuel.service;

import com.centroemmanuel.entity.DetalleElaboracion;
import com.centroemmanuel.repository.DetalleElaboracionRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleElaboracionService {

    private final DetalleElaboracionRepository detalleElaboracionRepository;

    public DetalleElaboracionService(
            DetalleElaboracionRepository detalleElaboracionRepository) {

        this.detalleElaboracionRepository =
                detalleElaboracionRepository;
    }

    public List<DetalleElaboracion> obtenerTodos() {

        return detalleElaboracionRepository.findAll();
    }

    public Optional<DetalleElaboracion> obtenerPorId(Integer id) {

        return detalleElaboracionRepository.findById(id);
    }

    public DetalleElaboracion guardar(
            DetalleElaboracion detalle) {

        return detalleElaboracionRepository.save(detalle);
    }

    public DetalleElaboracion actualizar(
            Integer id,
            DetalleElaboracion detalleActualizado) {

        Optional<DetalleElaboracion> existente =
                detalleElaboracionRepository.findById(id);

        if (existente.isEmpty()) {
            return null;
        }

        DetalleElaboracion detalle = existente.get();

        detalle.setElaboracion(
                detalleActualizado.getElaboracion()
        );

        detalle.setInsumoUtilizado(
                detalleActualizado.getInsumoUtilizado()
        );

        detalle.setCantidadUtilizada(
                detalleActualizado.getCantidadUtilizada()
        );

        detalle.setCostoUnitario(
                detalleActualizado.getCostoUnitario()
        );

        return detalleElaboracionRepository.save(detalle);
    }

    public boolean eliminar(Integer id) {

        if (!detalleElaboracionRepository.existsById(id)) {
            return false;
        }

        detalleElaboracionRepository.deleteById(id);

        return true;
    }
}