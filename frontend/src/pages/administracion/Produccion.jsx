import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import "../../styles/global.css";

function Produccion() {
  const [productos, setProductos] = useState([]);
  const [resumenStock, setResumenStock] = useState({});
  const [movimientos, setMovimientos] = useState([]);
  const [productoMovimientos, setProductoMovimientos] = useState(null);
  const [movimientoProducto, setMovimientoProducto] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState("ENTRADA");
  const [cantidadMovimiento, setCantidadMovimiento] = useState("");
  const [motivoMovimiento, setMotivoMovimiento] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      setCargando(true);
      setError("");
      const [respuesta, resumen] = await Promise.all([
        api.get("/productos"),
        api.get("/stock/resumen-productos")
      ]);
      setProductos(respuesta.data.filter((producto) => producto.tipo === "PRODUCTO"));
      setResumenStock(Object.fromEntries(
        resumen.data.map((item) => [item.idProducto, item])
      ));
    } catch (errorCarga) {
      console.error("Error al cargar productos de producción:", errorCarga);
      setError("No se pudieron cargar los productos de producción.");
    } finally {
      setCargando(false);
    }
  }

  async function verMovimientos(producto) {
    try {
      setError("");
      const respuesta = await api.get(`/stock/movimientos/${producto.idProducto}`);
      setProductoMovimientos(producto);
      setMovimientos(respuesta.data);
    } catch (errorMovimientos) {
      console.error("Error al cargar movimientos:", errorMovimientos);
      setError("No se pudieron cargar los movimientos del producto.");
    }
  }

  function abrirMovimiento(producto, tipo) {
    setMovimientoProducto(producto);
    setTipoMovimiento(tipo);
    setCantidadMovimiento("");
    setMotivoMovimiento("");
    setError("");
  }

  function cerrarMovimiento() {
    setMovimientoProducto(null);
    setCantidadMovimiento("");
    setMotivoMovimiento("");
  }

  async function registrarMovimiento(evento) {
    evento.preventDefault();
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    const cantidad = Number(cantidadMovimiento);

    if (!usuario?.idUsuario) {
      setError("No se pudo identificar el usuario conectado.");
      return;
    }
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      setError("La cantidad debe ser mayor que cero.");
      return;
    }

    try {
      await api.post("/stock/movimientos", {
        idProducto: movimientoProducto.idProducto,
        idUsuario: usuario.idUsuario,
        cantidad,
        tipo: tipoMovimiento,
        motivo: motivoMovimiento.trim() || "Movimiento manual"
      });
      cerrarMovimiento();
      await cargarProductos();
    } catch (errorMovimiento) {
      setError(errorMovimiento.response?.data?.mensaje || "No se pudo registrar el movimiento.");
    }
  }

  return (
    <div className="pagina">
      <Card title="· PRODUCCIÓN ·">
        {error && <div className="mensaje-error">{error}</div>}
        <div className="table-container">
          {cargando ? <p>Cargando productos...</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Entradas</th>
                  <th>Salidas</th>
                  <th>Stock actual</th>
                  <th>Stock mínimo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.idProducto}>
                    <td>{producto.nombreProducto}</td>
                    <td>+{resumenStock[producto.idProducto]?.entradas ?? 0}</td>
                    <td>-{resumenStock[producto.idProducto]?.salidas ?? 0}</td>
                    <td>{producto.stockActual ?? 0}</td>
                    <td>{producto.stockMinimo ?? 0}</td>
                    <td>{producto.activo ? "Activo" : "Inactivo"}</td>
                    <td>
                      <Button variant="primary" onClick={() => abrirMovimiento(producto, "ENTRADA")}>
                        + Entrada
                      </Button>
                      <Button variant="warning" onClick={() => abrirMovimiento(producto, "SALIDA")}>
                        - Salida
                      </Button>
                      <Button variant="secondary" onClick={() => verMovimientos(producto)}>
                        Ver movimientos
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {movimientoProducto && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{tipoMovimiento === "ENTRADA" ? "Registrar entrada" : "Registrar salida"}</h2>
              <p>{movimientoProducto.nombreProducto}</p>
              <form onSubmit={registrarMovimiento} className="form-field">
                <label>Cantidad *</label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={cantidadMovimiento}
                  onChange={(evento) => setCantidadMovimiento(evento.target.value)}
                  required
                />
                <label>Motivo</label>
                <Input
                  value={motivoMovimiento}
                  onChange={(evento) => setMotivoMovimiento(evento.target.value)}
                  placeholder="Ej. Elaboración, ajuste, venta"
                />
                <div className="modal-footer">
                  <Button type="button" variant="secondary" onClick={cerrarMovimiento}>Cancelar</Button>
                  <Button type="submit" className="btn btn-primary">Confirmar</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {productoMovimientos && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Movimientos: {productoMovimientos.nombreProducto}</h2>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr><th>Fecha</th><th>Tipo</th><th>Cantidad</th><th>Motivo</th></tr>
                  </thead>
                  <tbody>
                    {movimientos.length === 0 ? (
                      <tr><td colSpan="4">No hay movimientos registrados.</td></tr>
                    ) : movimientos.map((movimiento) => (
                      <tr key={movimiento.id}>
                        <td>{movimiento.fecha}</td>
                        <td>{movimiento.tipo}</td>
                        <td>{movimiento.tipo === "ENTRADA" ? "+" : "-"}{movimiento.cantidad}</td>
                        <td>{movimiento.motivo || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <Button type="button" variant="secondary" onClick={() => setProductoMovimientos(null)}>Cerrar</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Produccion;
