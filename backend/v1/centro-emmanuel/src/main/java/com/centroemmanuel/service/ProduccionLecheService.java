package com.centroemmanuel.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.centroemmanuel.entity.ProduccionLeche;
import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.enums.Categoria;
import com.centroemmanuel.repository.ProduccionLecheRepository;
import com.centroemmanuel.repository.ProductoRepository;
import com.centroemmanuel.repository.UsuarioRepository;
import java.math.BigDecimal;

@Service
public class ProduccionLecheService {

    private final ProduccionLecheRepository produccionLecheRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final StockService stockService;
    private final InventarioLecheService inventarioLecheService;
    private final AutorizacionService autorizacionService;

    public ProduccionLecheService(
            ProduccionLecheRepository produccionLecheRepository,
            UsuarioRepository usuarioRepository,
            ProductoRepository productoRepository,
            StockService stockService,
            InventarioLecheService inventarioLecheService,
            AutorizacionService autorizacionService) {

        this.produccionLecheRepository = produccionLecheRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.stockService = stockService;
        this.inventarioLecheService = inventarioLecheService;
        this.autorizacionService = autorizacionService;
    }

    public List<ProduccionLeche> listar() {
        return produccionLecheRepository.findAll();
    }

    public Optional<ProduccionLeche> buscarPorId(Integer id) {
        return produccionLecheRepository.findById(id);
    }

    @org.springframework.transaction.annotation.Transactional
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
        completarYValidarLitros(produccionLeche);
        inventarioLecheService.validarAsignaciones(produccionLeche, null);

        ProduccionLeche guardada = produccionLecheRepository.save(produccionLeche);
        stockService.registrarEntrada(
                productoLeche(),
                guardada.getLitrosTotales(),
                usuario.getIdUsuario(),
                "Producción diaria de leche");
        return guardada;
    }

    @org.springframework.transaction.annotation.Transactional
    public ProduccionLeche actualizar(Integer id, ProduccionLeche datos, Integer idActor) {

        Optional<ProduccionLeche> existente =
                produccionLecheRepository.findById(id);

        if (existente.isPresent()) {

            ProduccionLeche produccionLeche = existente.get();
            autorizacionService.validarResponsable(produccionLeche.getUsuario(), idActor);

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
            completarYValidarLitros(datos);
            datos.setIdProduccionLeche(id);
            inventarioLecheService.validarAsignaciones(datos, id);

            BigDecimal diferencia = datos.getLitrosTotales().subtract(
                    produccionLeche.getLitrosTotales() == null
                            ? BigDecimal.ZERO : produccionLeche.getLitrosTotales());
            Producto leche = productoLeche();
            if (diferencia.signum() > 0) {
                stockService.registrarEntrada(
                        leche, diferencia, produccionLeche.getUsuario().getIdUsuario(),
                        "Ajuste de producción de leche");
            } else if (diferencia.signum() < 0) {
                stockService.descontar(
                        leche, diferencia.abs(), produccionLeche.getUsuario(),
                        "Ajuste de producción de leche");
            }

            produccionLeche.setLitrosTotales(datos.getLitrosTotales());

            return produccionLecheRepository.save(produccionLeche);
        }

        return null;
    }

    @org.springframework.transaction.annotation.Transactional
    public void eliminar(Integer id, Integer idActor) {
        ProduccionLeche existente = produccionLecheRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No existe el registro de producción de leche."));
        autorizacionService.validarResponsable(existente.getUsuario(), idActor);
        ProduccionLeche sinAsignaciones = new ProduccionLeche();
        sinAsignaciones.setIdProduccionLeche(id);
        sinAsignaciones.setFecha(existente.getFecha());
        inventarioLecheService.validarAsignaciones(sinAsignaciones, id);
        if (existente.getLitrosTotales() != null) {
            stockService.descontar(
                    productoLeche(),
                    existente.getLitrosTotales(),
                    existente.getUsuario(),
                    "Eliminación de registro de producción de leche");
        }
        produccionLecheRepository.delete(existente);
    }

    private void completarYValidarLitros(ProduccionLeche registro) {
        BigDecimal asignado = sumaAsignaciones(registro);
        if (registro.getLitrosTotales() == null) {
            registro.setLitrosTotales(asignado);
        }
        if (registro.getLitrosTotales().signum() <= 0) {
            throw new IllegalArgumentException("Los litros totales producidos deben ser mayores que cero.");
        }
        for (BigDecimal cantidad : new BigDecimal[] {
                registro.getLitrosTerneros(),
                registro.getVentaDirecta(),
                registro.getConsumoCocina(),
                registro.getElaboracionQuesos(),
                registro.getElaboracionDulceDeLeche(),
                registro.getElaboracionQuark()}) {
            if (cantidad == null || cantidad.signum() < 0) {
                throw new IllegalArgumentException("Las cantidades asignadas no pueden ser negativas ni nulas.");
            }
        }
    }

    private BigDecimal sumaAsignaciones(ProduccionLeche registro) {
        return cero(registro.getLitrosTerneros())
                .add(cero(registro.getVentaDirecta()))
                .add(cero(registro.getConsumoCocina()))
                .add(cero(registro.getElaboracionQuesos()))
                .add(cero(registro.getElaboracionDulceDeLeche()))
                .add(cero(registro.getElaboracionQuark()));
    }

    private BigDecimal cero(BigDecimal valor) {
        return valor == null ? BigDecimal.ZERO : valor;
    }

    private Producto productoLeche() {
        return productoRepository.findAll().stream()
                .filter(producto -> producto.getCategoria() == Categoria.LECHE && producto.isActivo())
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Debe existir un producto con categoría Leche para registrar el inventario."));
    }
}
