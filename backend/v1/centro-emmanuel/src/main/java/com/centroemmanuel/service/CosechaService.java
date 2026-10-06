
package com.centroemmanuel.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.centroemmanuel.entity.Cosecha;
import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.repository.CosechaRepository;
import com.centroemmanuel.repository.ProductoRepository;
import com.centroemmanuel.repository.UsuarioRepository;

@Service
public class CosechaService {

    private final CosechaRepository cosechaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final StockService stockService;
    private final AutorizacionService autorizacionService;

    public CosechaService(CosechaRepository cosechaRepository, ProductoRepository productoRepository,
                          UsuarioRepository usuarioRepository, StockService stockService,
                          AutorizacionService autorizacionService) {
        this.cosechaRepository = cosechaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.stockService = stockService;
        this.autorizacionService = autorizacionService;
    }

    public List<Cosecha> listar() {
        return cosechaRepository.findAll();
    }

    public Optional<Cosecha> buscarPorId(Integer id) {
        return cosechaRepository.findById(id);
    }

    @Transactional
    public Cosecha guardar(Cosecha cosecha) {
        Producto producto = cargarProducto(cosecha);
        Usuario usuario = cargarUsuario(cosecha);
        cosecha.setProductoCosecha(producto);
        cosecha.setUsuario(usuario);
        Cosecha guardada = cosechaRepository.save(cosecha);
        stockService.registrarEntrada(producto, guardada.getCantidadCosecha(), usuario.getIdUsuario(),
                descripcionLote(guardada, producto));
        return guardada;
    }

    @Transactional
    public Cosecha actualizar(Integer id, Cosecha datos, Integer idActor) {
        Optional<Cosecha> existente = cosechaRepository.findById(id);
        if (existente.isEmpty()) {
            return null;
        }
        Cosecha cosecha = existente.get();
        autorizacionService.validarResponsable(cosecha.getUsuario(), idActor);
        Producto productoAnterior = cosecha.getProductoCosecha();
        BigDecimal cantidadAnterior = cosecha.getCantidadCosecha();
        Producto productoNuevo = cargarProducto(datos);
        Usuario usuario = cargarUsuario(datos);

        revertirStock(productoAnterior, cantidadAnterior, usuario, id);
        cosecha.setProductoCosecha(productoNuevo);
        cosecha.setCantidadCosecha(datos.getCantidadCosecha());
        cosecha.setObservaciones(datos.getObservaciones());
        stockService.registrarEntrada(productoNuevo, datos.getCantidadCosecha(), usuario.getIdUsuario(),
                descripcionLote(cosecha, productoNuevo) + " (corrección)");
        return cosechaRepository.save(cosecha);
    }

    @Transactional
    public void eliminar(Integer id, Integer idActor) {
        cosechaRepository.findById(id).ifPresent(cosecha -> {
            autorizacionService.validarResponsable(cosecha.getUsuario(), idActor);
            revertirStock(cosecha.getProductoCosecha(), cosecha.getCantidadCosecha(),
                    usuarioRepository.findById(idActor).orElse(cosecha.getUsuario()), id);
            cosechaRepository.deleteById(id);
        });
    }

    private String descripcionLote(Cosecha cosecha, Producto producto) {
        String sigla = java.text.Normalizer.normalize(producto.getNombreProducto(), java.text.Normalizer.Form.NFD)
                .replaceAll("[^A-Za-z]", "").toUpperCase(java.util.Locale.ROOT);
        sigla = sigla.length() > 3 ? sigla.substring(0, 3) : sigla;
        java.time.LocalDate fecha = cosecha.getFechaCosecha();
        StringBuilder texto = new StringBuilder("Lote " + sigla + "-"
                + (fecha == null ? "" : fecha.format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE))
                + "-" + cosecha.getIdCosecha() + " · Cosecha #" + cosecha.getIdCosecha());
        if (fecha != null) {
            texto.append(" · ").append(fecha.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        }
        if (cosecha.getUsuario() != null && cosecha.getUsuario().getNombreUsuario() != null) {
            texto.append(" · Responsable: ").append(cosecha.getUsuario().getNombreUsuario());
        }
        texto.append(". Cosechado: ").append(producto.getNombreProducto()).append(" ")
                .append(cosecha.getCantidadCosecha().stripTrailingZeros().toPlainString()).append(".");
        if (cosecha.getObservaciones() != null && !cosecha.getObservaciones().isBlank()) {
            texto.append(" Observaciones: ").append(cosecha.getObservaciones().trim());
        }
        String resultado = texto.toString();
        return resultado.length() > 990 ? resultado.substring(0, 990) : resultado;
    }
    private void revertirStock(Producto producto, BigDecimal cantidad, Usuario usuario, Integer id) {
        if (producto != null && cantidad != null && cantidad.signum() > 0) {
            stockService.descontar(producto, cantidad, usuario, "Anulación de cosecha de huerta #" + id);
        }
    }

    private Producto cargarProducto(Cosecha cosecha) {
        if (cosecha.getProductoCosecha() == null || cosecha.getProductoCosecha().getIdProducto() <= 0) {
            throw new IllegalArgumentException("Seleccione el insumo cosechado.");
        }
        if (cosecha.getCantidadCosecha() == null || cosecha.getCantidadCosecha().signum() <= 0) {
            throw new IllegalArgumentException("La cantidad cosechada debe ser mayor que cero.");
        }
        return productoRepository.findById(cosecha.getProductoCosecha().getIdProducto())
                .orElseThrow(() -> new IllegalArgumentException("El insumo no existe."));
    }

    private Usuario cargarUsuario(Cosecha cosecha) {
        if (cosecha.getUsuario() == null || cosecha.getUsuario().getIdUsuario() <= 0) {
            throw new IllegalArgumentException("No se pudo identificar al usuario.");
        }
        return usuarioRepository.findById(cosecha.getUsuario().getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe."));
    }
}