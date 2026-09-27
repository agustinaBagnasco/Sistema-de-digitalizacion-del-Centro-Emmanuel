package com.centroemmanuel.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.centroemmanuel.dto.PermisoRequest;
import com.centroemmanuel.dto.PermisoResponse;
import com.centroemmanuel.entity.Permiso;
import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.repository.PermisoRepository;
import com.centroemmanuel.repository.UsuarioRepository;

@Service
public class PermisoService {

    private final PermisoRepository permisoRepository;
    private final UsuarioRepository usuarioRepository;


    public PermisoService(PermisoRepository permisoRepository, UsuarioRepository usuarioRepository) {
        this.permisoRepository = permisoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional (readOnly = true)
    public List<PermisoResponse> listarTodos() {
        return permisoRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<PermisoResponse> buscarPorId(int id) {
        return permisoRepository.findById(id)
                .map(this::convertirADTO);
    }

    @Transactional
    public PermisoResponse crear(PermisoRequest request, int idUsuario) {
        validar(request);
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("El usuario indicado no existe."));

        Permiso permiso = new Permiso();
        permiso.setNombrePermiso(request.getNombrePermiso().trim());
        permiso.setDescripcion(normalizarDescripcion(request.getDescripcion()));
        permiso.setUsuarioCreacion(usuario);
        permiso.setUsuarioModificacion(usuario);

        return convertirADTO(permisoRepository.save(permiso));
    }

    @Transactional
    public Optional<PermisoResponse> actualizar(int id, PermisoRequest request, int idUsuario) {
        validar(request);
        Optional<Permiso> permisoEncontrado = permisoRepository.findById(id);
        if (permisoEncontrado.isEmpty()) {
            return Optional.empty();
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("El usuario indicado no existe."));
        Permiso permiso = permisoEncontrado.get();
        permiso.setNombrePermiso(request.getNombrePermiso().trim());
        permiso.setDescripcion(normalizarDescripcion(request.getDescripcion()));
        permiso.setUsuarioModificacion(usuario);

        return Optional.of(convertirADTO(permisoRepository.save(permiso)));
    }

    @Transactional
    public boolean eliminar(int id) {
        if (!permisoRepository.existsById(id)) {
            return false;
        }
        permisoRepository.deleteById(id);
        return true;
    }

    private void validar(PermisoRequest request) {
        if (request == null || request.getNombrePermiso() == null || request.getNombrePermiso().isBlank()) {
            throw new IllegalArgumentException("Debe ingresar un nombre de permiso.");
        }
    }

    private String normalizarDescripcion(String descripcion) {
        return descripcion == null || descripcion.isBlank() ? null : descripcion.trim();
    }

    private PermisoResponse convertirADTO(Permiso permiso) {
        Usuario creador = permiso.getUsuarioCreacion();

        return new PermisoResponse(
                permiso.getIdPermiso(),
                permiso.getNombrePermiso(),
                permiso.getDescripcion(),
                creador == null ? null : creador.getIdUsuario(),
                obtenerNombreUsuario(creador));
    }

    private String obtenerNombreUsuario(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        String nombre = usuario.getNombre() == null ? "" : usuario.getNombre().trim();
        String apellido = usuario.getApellido() == null ? "" : usuario.getApellido().trim();
        String nombreCompleto = (nombre + " " + apellido).trim();
        return nombreCompleto.isEmpty() ? usuario.getNombreUsuario() : nombreCompleto;
    }
}