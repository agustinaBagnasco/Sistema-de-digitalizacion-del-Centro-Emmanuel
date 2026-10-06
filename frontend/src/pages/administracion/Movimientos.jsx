import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { sortActiveLast } from "../../utils/sortActiveLast";
import { formatearNumero } from "../../utils/formatNumber";
import "../../styles/global.css";

const etiquetasDestinoLeche = {
  TERNEROS: "Terneros",
  VENTA_DIRECTA: "Venta directa",
  CONSUMO_COCINA: "Cocina",
  QUESO: "Queso",
  DULCE_DE_LECHE: "Dulce de leche",
  QUARK: "Quark",
};

function Movimientos() {
  const [productos, setProductos] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [resumenStock, setResumenStock] = useState({});
  const [inventarioLeche, setInventarioLeche] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [productoMovimientos, setProductoMovimientos] = useState(null);
  const [movimientoProducto, setMovimientoProducto] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState("ENTRADA");
  const [cantidadMovimiento, setCantidadMovimiento] = useState("");
  const [motivoMovimiento, setMotivoMovimiento] = useState("");
  const [destinoLeche, setDestinoLeche] = useState("");
  const [vista, setVista] = useState("general");
  const [ordenTipo, setOrdenTipo] = useState(null);
  const [error, setError] = useState("");
  const [errorMovimiento, setErrorMovimiento] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardandoMovimiento, setGuardandoMovimiento] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      setCargando(true);
      setError("");
      const [respuesta, resumenProductos, resumenInsumos, respuestaInventarioLeche] = await Promise.all([
        api.get("/productos"),
        api.get("/stock/resumen-productos"),
        api.get("/stock/resumen-insumos"),
        api.get("/produccion-leche/inventario")
      ]);
      setInventarioLeche(respuestaInventarioLeche.data);
      setProductos(respuesta.data.filter((producto) =>
        producto.tipo === "PRODUCTO" || producto.tipo === "INSUMO"
      ));
      setResumenStock(Object.fromEntries(
        [...resumenProductos.data, ...resumenInsumos.data]
          .map((item) => [item.idProducto, item])
      ));
    } catch (errorCarga) {
      console.error("Error al cargar productos e insumos:", errorCarga);
      setError("No se pudieron cargar los productos e insumos.");
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
    setDestinoLeche("");
    setError("");
    setErrorMovimiento("");
  }

  function cerrarMovimiento() {
    setMovimientoProducto(null);
    setCantidadMovimiento("");
    setMotivoMovimiento("");
    setErrorMovimiento("");
  }

  async function registrarMovimiento(evento) {
    evento.preventDefault();
    setErrorMovimiento("");
    const cantidad = Number(cantidadMovimiento);

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      setErrorMovimiento("La cantidad debe ser mayor que cero.");
      return;
    }

    setGuardandoMovimiento(true);
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
      if (!usuario?.idUsuario) {
        setErrorMovimiento("No se pudo identificar el usuario conectado.");
        return;
      }

      await api.post("/stock/movimientos", {
        idProducto: movimientoProducto.idProducto,
        idUsuario: usuario.idUsuario,
        cantidad,
        tipo: tipoMovimiento,
        motivo: motivoMovimiento.trim() || "Movimiento manual",
        destinoLeche: movimientoProducto.categoria === "LECHE" && tipoMovimiento === "SALIDA"
          ? destinoLeche : null
      });
      cerrarMovimiento();
      await cargarProductos();
      window.dispatchEvent(new Event("alertas-stock:actualizar"));
    } catch (errorMovimiento) {
      console.error("Error al registrar movimiento de stock:", errorMovimiento);
      setErrorMovimiento(
        errorMovimiento.response?.data?.mensaje
        || errorMovimiento.response?.data?.message
        || "No se pudo registrar el movimiento. Verifique la conexión e inténtelo nuevamente."
      );
    } finally {
      setGuardandoMovimiento(false);
    }
  }

  const consultaProducto = busquedaProducto.trim().toLocaleLowerCase("es");
  const coincideBusqueda = (producto) =>
    String(producto.nombreProducto || "").toLocaleLowerCase("es").includes(consultaProducto);
  const productosFiltrados = sortActiveLast(productos
    .filter((producto) => producto.categoria !== "LECHE" && coincideBusqueda(producto)))
    .sort((a, b) => ordenTipo
      ? Number(a.activo === false) - Number(b.activo === false)
        || a.tipo.localeCompare(b.tipo) * (ordenTipo === "asc" ? 1 : -1)
      : 0);
  const productosLeche = sortActiveLast(productos.filter(
    (producto) => producto.categoria === "LECHE" && coincideBusqueda(producto)));

  return (
    <div className="pagina">
      <Card title="· MOVIMIENTOS ·">
        {error && <div className="mensaje-error">{error}</div>}
        <div className="productos-table-container">
          {cargando ? <p>Cargando productos e insumos...</p> : (
            <>
            <div className="input-group" style={{ maxWidth: "420px", marginBottom: "16px" }}>
              <label htmlFor="buscar-producto-movimientos">Buscar producto o insumo</label>
              <Input
                id="buscar-producto-movimientos"
                type="search"
                value={busquedaProducto}
                onChange={(evento) => setBusquedaProducto(evento.target.value)}
                placeholder="Nombre del producto o insumo"
              />
            </div>
            <div className="table-actions" style={{ marginBottom: "16px" }}>
              <Button variant={vista === "general" ? "primary" : "secondary"} onClick={() => setVista("general")}>
                Productos e insumos
              </Button>
              <Button variant={vista === "leche" ? "primary" : "secondary"} onClick={() => setVista("leche")}>
                Leche
              </Button>
            </div>
            {vista === "general" && (
            <div className="table-container">
              <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th
                    onClick={() => setOrdenTipo(ordenTipo === "asc" ? "desc" : "asc")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    title="Ordenar por tipo"
                  >
                    Tipo {ordenTipo === "asc" ? "▲" : ordenTipo === "desc" ? "▼" : "↕"}
                  </th>
                  <th>Entradas</th>
                  <th>Salidas</th>
                  <th>Stock actual</th>
                  <th>Stock mínimo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      {productos.length === 0 && productosLeche.length === 0
                        ? "No hay productos ni insumos registrados."
                        : "No hay productos ni insumos que coincidan con la búsqueda."}
                    </td>
                  </tr>
                ) : productosFiltrados.map((producto) => (
                  <tr key={producto.idProducto}>
                    <td>
                      {producto.nombreProducto}
                    </td>
                    <td>{producto.tipo === "INSUMO" ? "Insumo" : "Producto"}</td>
                    <td>+{formatearNumero(resumenStock[producto.idProducto]?.entradas)}</td>
                    <td>-{formatearNumero(resumenStock[producto.idProducto]?.salidas)}</td>
                    <td>{formatearNumero(producto.stockActual)}</td>
                    <td>{formatearNumero(producto.stockMinimo)}</td>
                    <td>{producto.activo ? "Activo" : "Inactivo"}</td>
                    <td>
                      <div className="table-actions">
                        <Button variant="primary" onClick={() => abrirMovimiento(producto, "ENTRADA")}>
                          + Entrada
                        </Button>
                        <Button variant="warning" onClick={() => abrirMovimiento(producto, "SALIDA")}>
                          - Salida
                        </Button>
                        <Button variant="secondary" onClick={() => verMovimientos(producto)}>
                          Ver movimientos
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            )}
            {vista === "leche" && productosLeche.length === 0 && (
              <p>No hay producto de leche que coincida con la búsqueda.</p>
            )}
            {vista === "leche" && productosLeche.map((producto) => (
              <div className="table-container" key={producto.idProducto}>
                <h3>Leche</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th><th>Entradas</th><th>Salidas</th>
                      <th>Stock actual</th><th>Stock mínimo</th><th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{producto.nombreProducto}</td>
                      <td>+{formatearNumero(resumenStock[producto.idProducto]?.entradas)}</td>
                      <td>-{formatearNumero(resumenStock[producto.idProducto]?.salidas)}</td>
                      <td>{formatearNumero(producto.stockActual)} L</td>
                      <td>{formatearNumero(producto.stockMinimo)} L</td>
                      <td>
                        <div className="table-actions">
                          <Button variant="primary" onClick={() => abrirMovimiento(producto, "ENTRADA")}>
                            + Entrada
                          </Button>
                          <Button variant="warning" onClick={() => abrirMovimiento(producto, "SALIDA")}>
                            - Salida
                          </Button>
                          <Button variant="secondary" onClick={() => verMovimientos(producto)}>
                            Ver movimientos
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {inventarioLeche?.areas && (
                  <>
                    <strong>Inventario de leche por destino (L)</strong>
                    <table className="table">
                      <thead>
                        <tr><th>Destino</th><th>Asignados</th><th>Utilizados</th><th>Disponibles</th></tr>
                      </thead>
                      <tbody>
                        {inventarioLeche.areas.map((area) => (
                          <tr key={area.destino}>
                            <td>{area.etiqueta}</td>
                            <td>{formatearNumero(area.asignado)}</td>
                            <td>{formatearNumero(area.utilizado)}</td>
                            <td>{formatearNumero(area.disponible)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            ))}
            </>
          )}
        </div>

        {movimientoProducto && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{tipoMovimiento === "ENTRADA" ? "Registrar entrada" : "Registrar salida"}</h2>
              <p>{movimientoProducto.nombreProducto}</p>
              <p>Stock actual: {formatearNumero(movimientoProducto.stockActual)} {movimientoProducto.unidadMedida}</p>
              <form onSubmit={registrarMovimiento} className="form-field">
                {errorMovimiento && <div className="mensaje-error" role="alert">{errorMovimiento}</div>}
                <label>Cantidad *</label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={cantidadMovimiento}
                  onChange={(evento) => setCantidadMovimiento(evento.target.value)}
                  required
                />
                {movimientoProducto.categoria === "LECHE" && tipoMovimiento === "SALIDA" && (
                  <>
                    <label htmlFor="destino-leche-movimiento">Destino de la leche *</label>
                    <select
                      id="destino-leche-movimiento"
                      className="select"
                      value={destinoLeche}
                      onChange={(evento) => setDestinoLeche(evento.target.value)}
                      required
                    >
                      <option value="">Seleccione un destino</option>
                      <option value="TERNEROS">Terneros</option>
                      <option value="VENTA_DIRECTA">Venta directa</option>
                      <option value="CONSUMO_COCINA">Cocina</option>
                      <option value="QUESO">Queso</option>
                      <option value="DULCE_DE_LECHE">Dulce de leche</option>
                      <option value="QUARK">Quark</option>
                    </select>
                  </>
                )}
                <label>Motivo</label>
                <Input
                  value={motivoMovimiento}
                  onChange={(evento) => setMotivoMovimiento(evento.target.value)}
                  placeholder="Ej. Elaboración, ajuste, venta"
                />
                <div className="modal-footer">
                  <Button type="button" variant="secondary" onClick={cerrarMovimiento} disabled={guardandoMovimiento}>Cancelar</Button>
                  <Button type="submit" className="btn btn-primary" disabled={guardandoMovimiento}>
                    {guardandoMovimiento ? "Guardando..." : "Confirmar"}
                  </Button>
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
                    <tr><th>Fecha</th><th>Tipo</th><th>Cantidad</th><th>Destino</th><th>Motivo</th><th>Usuario</th></tr>
                  </thead>
                  <tbody>
                    {movimientos.length === 0 ? (
                      <tr><td colSpan="6">No hay movimientos registrados.</td></tr>
                    ) : movimientos.map((movimiento) => (
                      <tr key={movimiento.id}>
                        <td>{new Intl.DateTimeFormat("es-UY", {
                          dateStyle: "short",
                          timeStyle: "medium"
                        }).format(new Date(movimiento.fecha))}</td>
                        <td>{movimiento.tipo}</td>
                        <td>{movimiento.tipo === "ENTRADA" ? "+" : "-"}{formatearNumero(movimiento.cantidad)}</td>
                        <td>{etiquetasDestinoLeche[movimiento.destinoLeche] || "-"}</td>
                        <td>{movimiento.motivo || "-"}</td>
                        <td>{movimiento.usuario || "-"}</td>
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

export default Movimientos;
