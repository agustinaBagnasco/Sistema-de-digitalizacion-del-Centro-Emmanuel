package com.centroemmanuel.service;

import org.springframework.stereotype.Service;

import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.repository.UsuarioRepository;

@Service
public class AutorizacionService {

    private static final int PERMISO_ADMINISTRADOR = 1;

    private final UsuarioRepository usuarioRepository;

    public AutorizacionService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Solo el responsable del registro o un usuario con el permiso 1 puede modificarlo o borrarlo
    public void validarResponsable(Usuario responsable, Integer idActor) {
        if (idActor == null) {
            throw new SecurityException("No se pudo identificar al usuario que realiza la operación.");
        }
        if (responsable != null && responsable.getIdUsuario() == idActor) {
            return;
        }
        boolean administrador = usuarioRepository.findById(idActor)
                .map(u -> u.getPermisos() != null && u.getPermisos().stream()
                        .anyMatch(p -> p.getIdPermiso() == PERMISO_ADMINISTRADOR))
                .orElse(false);
        if (!administrador) {
            throw new SecurityException("Solo el responsable del registro puede modificarlo o eliminarlo.");
        }
    }
}