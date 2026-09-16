package com.centroemmanuel.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.centroemmanuel.entity.ProduccionLeche;
import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.repository.ProduccionLecheRepository;
import com.centroemmanuel.repository.UsuarioRepository;

@Service
public class ProduccionLecheService {

    private final ProduccionLecheRepository produccionLecheRepository;
    private final UsuarioRepository usuarioRepository;

    public ProduccionLecheService(
            ProduccionLecheRepository produccionLecheRepository,
            UsuarioRepository usuarioRepository) {

        this.produccionLecheRepository = produccionLecheRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Listar todas las producciones de leche
    public List<ProduccionLeche> listar() {
        return produccionLecheRepository.findAll();
    }

    // Buscar una producción de leche por ID
    public Optional<ProduccionLeche> buscarPorId(Integer id) {
        return produccionLecheRepository.findById(id);
    }

    // Guardar una producción de leche
    public ProduccionLeche guardar(ProduccionLeche produccionLeche) {

        if (produccionLeche.getUsuario() == null ||
            produccionLeche.getUsuario().getIdUsuario() == 0) {

            throw new RuntimeException(
                    "No se recibió el usuario que registra la producción."
            );
        }

        Integer idUsuario =
                produccionLeche.getUsuario().getIdUsuario();

        Usuario usuario = usuarioRepository
                .findById(idUsuario)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No existe el usuario con ID: " + idUsuario
                        )
                );

        produccionLeche.setUsuario(usuario);

        return produccionLecheRepository.save(produccionLeche);
    }

    // Actualizar una producción de leche
    public ProduccionLeche actualizar(Integer id, ProduccionLeche datos) {

        Optional<ProduccionLeche> existente =
                produccionLecheRepository.findById(id);

        if (existente.isPresent()) {

            ProduccionLeche produccionLeche = existente.get();

            produccionLeche.setFecha(datos.getFecha());
            produccionLeche.setLitrosTerneros(datos.getLitrosTerneros());
            produccionLeche.setVentaDirecta(datos.getVentaDirecta());
            produccionLeche.setConsumoCocina(datos.getConsumoCocina());
            produccionLeche.setElaboracionQuesos(
                    datos.getElaboracionQuesos()
            );
            produccionLeche.setElaboracionDulceDeLeche(
                    datos.getElaboracionDulceDeLeche()
            );
            produccionLeche.setElaboracionQuark(
                    datos.getElaboracionQuark()
            );
            produccionLeche.setComentario(datos.getComentario());

            /*
             * NO modificamos el usuario al actualizar.
             * El registro conserva el usuario que originalmente
             * realizó la carga.
             */

            return produccionLecheRepository.save(produccionLeche);
        }

        return null;
    }

    // Eliminar una producción de leche
    public void eliminar(Integer id) {
        produccionLecheRepository.deleteById(id);
    }
}

