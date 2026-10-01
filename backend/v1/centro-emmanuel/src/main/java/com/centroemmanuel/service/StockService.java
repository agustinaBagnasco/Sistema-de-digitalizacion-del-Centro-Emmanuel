package com.centroemmanuel.service;

import com.centroemmanuel.dto.MovimientoStockRequest;
import com.centroemmanuel.dto.StockResumenResponse;
import com.centroemmanuel.dto.MovimientoStockResponse;
import com.centroemmanuel.entity.MovimientoStock;
import com.centroemmanuel.entity.Producto;
import com.centroemmanuel.entity.Usuario;
import com.centroemmanuel.enums.Tipo;
import com.centroemmanuel.repository.ProductoRepository;
import com.centroemmanuel.repository.MovimientoStockRepository;
import com.centroemmanuel.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StockService {
	private final ProductoRepository productoRepository;
	private final MovimientoStockRepository movimientoStockRepository;
	private final UsuarioRepository usuarioRepository;

	public StockService(ProductoRepository productoRepository,
						MovimientoStockRepository movimientoStockRepository,
						UsuarioRepository usuarioRepository) {
		this.productoRepository = productoRepository;
		this.movimientoStockRepository = movimientoStockRepository;
		this.usuarioRepository = usuarioRepository;
	}

	@Transactional
	public void descontar(Producto producto, BigDecimal cantidad, Usuario usuario, String motivo) {
		BigDecimal stockActual = producto.getStockActual() == null ? BigDecimal.ZERO : producto.getStockActual();
		if (cantidad == null || cantidad.signum() <= 0 || stockActual.compareTo(cantidad) < 0) {
			throw new IllegalArgumentException("Stock insuficiente para '" + producto.getNombreProducto() + "'.");
		}
		producto.setStockActual(stockActual.subtract(cantidad));
		productoRepository.save(producto);
		registrarMovimiento(producto, cantidad, "SALIDA", motivo, usuario);
	}

	@Transactional
	public void registrarEntrada(Producto producto, BigDecimal cantidad, Integer idUsuario, String motivo) {
		if (cantidad == null || cantidad.signum() <= 0) {
			return;
		}
		Usuario usuario = usuarioRepository.findById(idUsuario)
				.orElseThrow(() -> new IllegalArgumentException("El usuario no existe."));
		BigDecimal stockActual = producto.getStockActual() == null ? BigDecimal.ZERO : producto.getStockActual();
		producto.setStockActual(stockActual.add(cantidad));
		productoRepository.save(producto);
		registrarMovimiento(producto, cantidad, "ENTRADA", motivo, usuario);
	}

	@Transactional
	public void registrarMovimiento(MovimientoStockRequest request) {
		if (request == null || request.getIdProducto() == null || request.getIdUsuario() == null
				|| request.getCantidad() == null || request.getCantidad().signum() <= 0) {
			throw new IllegalArgumentException("Producto, usuario y una cantidad positiva son obligatorios.");
		}
		String tipo = request.getTipo() == null ? "" : request.getTipo().trim().toUpperCase();
		if (!tipo.equals("ENTRADA") && !tipo.equals("SALIDA")) {
			throw new IllegalArgumentException("El tipo de movimiento debe ser ENTRADA o SALIDA.");
		}
		Producto producto = productoRepository.findById(request.getIdProducto())
				.orElseThrow(() -> new IllegalArgumentException("El producto no existe."));
		Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
				.orElseThrow(() -> new IllegalArgumentException("El usuario no existe."));
		BigDecimal stockActual = producto.getStockActual() == null ? BigDecimal.ZERO : producto.getStockActual();
		if (tipo.equals("SALIDA") && stockActual.compareTo(request.getCantidad()) < 0) {
			throw new IllegalArgumentException("Stock insuficiente para '" + producto.getNombreProducto() + "'.");
		}
		producto.setStockActual(tipo.equals("ENTRADA")
				? stockActual.add(request.getCantidad())
				: stockActual.subtract(request.getCantidad()));
		productoRepository.save(producto);
		registrarMovimiento(producto, request.getCantidad(), tipo, request.getMotivo(), usuario);
	}

	public List<StockResumenResponse> resumenInsumos() {
		return resumenPorTipo(Tipo.INSUMO);
	}

	public List<StockResumenResponse> resumenProductos() {
		return resumenPorTipo(Tipo.PRODUCTO);
	}

	private List<StockResumenResponse> resumenPorTipo(Tipo tipo) {
		Map<Integer, BigDecimal[]> resumen = new HashMap<>();
		productoRepository.findAll().stream()
				.filter(producto -> producto.getTipo() == tipo)
				.forEach(producto -> resumen.put(producto.getIdProducto(), new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO}));

		for (MovimientoStock movimiento : movimientoStockRepository.findAll()) {
			BigDecimal[] totales = resumen.get(movimiento.getProductoMov().getIdProducto());
			if (totales == null) continue;
			if ("ENTRADA".equalsIgnoreCase(movimiento.getTipoMov())) {
				totales[0] = totales[0].add(movimiento.getCantidadMov());
			} else if ("SALIDA".equalsIgnoreCase(movimiento.getTipoMov())) {
				totales[1] = totales[1].add(movimiento.getCantidadMov());
			}
		}
		List<StockResumenResponse> resultado = new ArrayList<>();
		resumen.forEach((id, totales) -> resultado.add(
				new StockResumenResponse(id, totales[0], totales[1])));
		return resultado;
	}

	public List<MovimientoStockResponse> movimientosProducto(Integer idProducto) {
		return movimientoStockRepository.findByProductoMovIdProducto(idProducto).stream()
				.map(movimiento -> new MovimientoStockResponse(
						movimiento.getIdMovStock(),
						movimiento.getCantidadMov(),
						movimiento.getTipoMov(),
						movimiento.getFechaMov(),
						movimiento.getMotivoMov(),
						movimiento.getUsuario() == null
								? null
								: movimiento.getUsuario().getNombreUsuario()))
				.toList();
	}

    public List<Producto> alertasStockMinimo() {
	return productoRepository.findAll().stream()
		.filter(producto -> producto.getStockActual() != null
			&& producto.getStockMinimo() != null
			&& producto.getStockActual().compareTo(producto.getStockMinimo()) <= 0)
		.toList();
    }

	private void registrarMovimiento(Producto producto, BigDecimal cantidad, String tipo,
									 String motivo, Usuario usuario) {
		MovimientoStock movimiento = new MovimientoStock();
		movimiento.setProductoMov(producto);
		movimiento.setCantidadMov(cantidad);
		movimiento.setTipoMov(tipo);
		movimiento.setMotivoMov(motivo);
		movimiento.setUsuario(usuario);
		movimientoStockRepository.save(movimiento);
	}
}
