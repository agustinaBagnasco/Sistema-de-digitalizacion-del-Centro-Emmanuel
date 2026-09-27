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
	public void descontar(Producto producto, double cantidad, Usuario usuario, String motivo) {
		double stockActual = producto.getStockActual() == null ? 0 : producto.getStockActual();
		if (cantidad <= 0 || stockActual < cantidad) {
			throw new IllegalArgumentException("Stock insuficiente para '" + producto.getNombreProducto() + "'.");
		}
		producto.setStockActual(stockActual - cantidad);
		productoRepository.save(producto);
		registrarMovimiento(producto, cantidad, "SALIDA", motivo, usuario);
	}

	@Transactional
	public void registrarMovimiento(MovimientoStockRequest request) {
		if (request == null || request.getIdProducto() == null || request.getIdUsuario() == null
				|| request.getCantidad() == null || request.getCantidad() <= 0) {
			throw new IllegalArgumentException("Producto, usuario y una cantidad positiva son obligatorios.");
		}
		String tipo = request.getTipo() == null ? "" : request.getTipo().trim().toUpperCase();
		if (!tipo.equals("ENTRADA") && !tipo.equals("SALIDA")) {
			throw new IllegalArgumentException("El tipo de movimiento debe ser ENTRADA o SALIDA.");
		}
		Producto producto = productoRepository.findById(request.getIdProducto())
				.orElseThrow(() -> new IllegalArgumentException("El insumo no existe."));
		if (producto.getTipo() != Tipo.INSUMO) {
			throw new IllegalArgumentException("El producto seleccionado no es un insumo.");
		}
		Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
				.orElseThrow(() -> new IllegalArgumentException("El usuario no existe."));
		double stockActual = producto.getStockActual() == null ? 0 : producto.getStockActual();
		if (tipo.equals("SALIDA") && stockActual < request.getCantidad()) {
			throw new IllegalArgumentException("Stock insuficiente para '" + producto.getNombreProducto() + "'.");
		}
		producto.setStockActual(tipo.equals("ENTRADA")
				? stockActual + request.getCantidad()
				: stockActual - request.getCantidad());
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
		Map<Integer, double[]> resumen = new HashMap<>();
		productoRepository.findAll().stream()
				.filter(producto -> producto.getTipo() == tipo)
				.forEach(producto -> resumen.put(producto.getIdProducto(), new double[]{0, 0}));

		for (MovimientoStock movimiento : movimientoStockRepository.findAll()) {
			double[] totales = resumen.get(movimiento.getProductoMov().getIdProducto());
			if (totales == null) continue;
			if ("ENTRADA".equalsIgnoreCase(movimiento.getTipoMov())) {
				totales[0] += movimiento.getCantidadMov();
			} else if ("SALIDA".equalsIgnoreCase(movimiento.getTipoMov())) {
				totales[1] += movimiento.getCantidadMov();
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
						movimiento.getMotivoMov()))
				.toList();
	}

    public List<Producto> alertasStockMinimo() {
	return productoRepository.findAll().stream()
		.filter(producto -> producto.getStockActual() != null
			&& producto.getStockMinimo() != null
			&& producto.getStockActual() <= producto.getStockMinimo())
		.toList();
    }

	private void registrarMovimiento(Producto producto, double cantidad, String tipo,
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
