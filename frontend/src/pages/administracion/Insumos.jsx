import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import "../../styles/global.css";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";

function Insumos() {

  const [insumos, setInsumos] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [resumenStock, setResumenStock] = useState({});

  const [mostrarModal, setMostrarModal] = useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [insumoEditando, setInsumoEditando] = useState(null);

  const [nombreInsumo, setNombreInsumo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [activo, setActivo] = useState(true);
  const [movimientoInsumo, setMovimientoInsumo] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState("ENTRADA");
  const [cantidadMovimiento, setCantidadMovimiento] = useState("");
  const [motivoMovimiento, setMotivoMovimiento] = useState("");

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);


  // ==========================================================
  // CARGAR DATOS
  // ==========================================================

  useEffect(() => {
    cargarInsumos();
    cargarUnidadesMedida();
  }, []);


  async function cargarInsumos() {

    try {

      setCargando(true);
      setError("");

      const [respuesta, resumen] = await Promise.all([
        api.get("/productos"),
        api.get("/stock/resumen-insumos")
      ]);

      // Solo mostramos los que son INSUMOS
      const datosInsumos = respuesta.data.filter(
        (item) => item.tipo === "INSUMO"
      );

      setInsumos(datosInsumos);
      setResumenStock(Object.fromEntries(
        resumen.data.map((item) => [item.idProducto, item])
      ));

    } catch (error) {

      console.error("Error al cargar insumos:", error);
      setError("No se pudieron cargar los insumos.");

    } finally {

      setCargando(false);
    }
  }


  async function cargarUnidadesMedida() {

    try {

      const respuesta = await api.get("/unidades-medida");
      setUnidadesMedida(respuesta.data);

    } catch (error) {

      console.error("Error al cargar unidades de medida:", error);

    }
  }


  // ==========================================================
  // LIMPIAR FORMULARIO
  // ==========================================================

  const limpiarFormulario = () => {

    setNombreInsumo("");
    setDescripcion("");
    setStockActual("");
    setStockMinimo("");
    setUnidadMedida("");
    setActivo(true);

    setInsumoEditando(null);
    setModoEdicion(false);

    setError("");
  };


  // ==========================================================
  // NUEVO INSUMO
  // ==========================================================

  const abrirNuevoInsumo = () => {

    limpiarFormulario();
    setMostrarModal(true);

  };


  // ==========================================================
  // EDITAR INSUMO
  // ==========================================================

  const abrirEditarInsumo = (insumo) => {

    setModoEdicion(true);
    setInsumoEditando(insumo);

    setNombreInsumo(insumo.nombreProducto || "");
    setDescripcion(insumo.descripcion || "");

    setStockActual(
      insumo.stockActual !== null &&
        insumo.stockActual !== undefined
        ? insumo.stockActual
        : ""
    );

    setStockMinimo(
      insumo.stockMinimo !== null &&
        insumo.stockMinimo !== undefined
        ? insumo.stockMinimo
        : ""
    );

    setUnidadMedida(insumo.unidadMedida || "");

    setActivo(insumo.activo);

    setError("");
    setMostrarModal(true);
  };


  // ==========================================================
  // CERRAR MODAL
  // ==========================================================

  const cerrarModal = () => {

    setMostrarModal(false);
    limpiarFormulario();

  };


  // ==========================================================
  // GUARDAR INSUMO
  // ==========================================================

  const guardarInsumo = async (e) => {

    e.preventDefault();
    setError("");


    // Validaciones

    if (!nombreInsumo.trim()) {

      setError("El nombre del insumo es obligatorio.");
      return;

    }

    if (!unidadMedida) {

      setError("Debe seleccionar una unidad de medida.");
      return;

    }


    const insumo = {

      nombreProducto: nombreInsumo.trim(),

      descripcion: descripcion.trim(),

      stockActual:
        stockActual === ""
          ? 0
          : Number(stockActual),

      stockMinimo:
        stockMinimo === ""
          ? 0
          : Number(stockMinimo),

      activo: activo,

      // IMPORTANTE
      tipo: "INSUMO",

      unidadMedida: unidadMedida
    };


    try {

      if (modoEdicion) {

        await api.put(
          `/productos/${insumoEditando.idProducto}`,
          insumo
        );

      } else {

        await api.post(
          "/productos",
          insumo
        );

      }

      await cargarInsumos();

      cerrarModal();

    } catch (error) {

      console.error("Error al guardar insumo:", error);

      if (error.response?.data?.message) {

        setError(error.response.data.message);

      } else {

        setError("No se pudo guardar el insumo.");

      }
    }
  };


  // ==========================================================
  // ACTIVAR / DESACTIVAR
  // ==========================================================

  const cambiarEstado = async (insumo) => {

    try {

      const insumoActualizado = {

        nombreProducto: insumo.nombreProducto,

        descripcion: insumo.descripcion,

        stockActual: insumo.stockActual,

        stockMinimo: insumo.stockMinimo,
        activo: !insumo.activo,

        tipo: "INSUMO",

        unidadMedida: insumo.unidadMedida || null
      };


      await api.put(
        `/productos/${insumo.idProducto}`,
        insumoActualizado
      );

      await cargarInsumos();

    } catch (error) {

      console.error(
        "Error al cambiar estado:",
        error
      );

      setError(
        "No se pudo cambiar el estado del insumo."
      );
    }
  };


  // ==========================================================
  // ELIMINAR
  // ==========================================================

  const eliminarInsumo = async (insumo) => {

    const confirmar = window.confirm(
      `¿Está seguro que desea eliminar el insumo "${insumo.nombreProducto}"?`
    );

    if (!confirmar) {
      return;
    }


    try {

      await api.delete(
        `/productos/${insumo.idProducto}`
      );

      await cargarInsumos();

    } catch (error) {

      console.error(
        "Error al eliminar insumo:",
        error
      );

      setError(
        "No se pudo eliminar el insumo."
      );
    }
  };

  const abrirMovimiento = (insumo, tipo) => {
    setMovimientoInsumo(insumo);
    setTipoMovimiento(tipo);
    setCantidadMovimiento("");
    setMotivoMovimiento("");
    setError("");
  };

  const cerrarMovimiento = () => {
    setMovimientoInsumo(null);
    setCantidadMovimiento("");
    setMotivoMovimiento("");
  };

  const registrarMovimiento = async (e) => {
    e.preventDefault();
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
        idProducto: movimientoInsumo.idProducto,
        idUsuario: usuario.idUsuario,
        cantidad,
        tipo: tipoMovimiento,
        motivo: motivoMovimiento.trim() || "Movimiento manual"
      });
      cerrarMovimiento();
      await cargarInsumos();
    } catch (error) {
      setError(error.response?.data?.mensaje || "No se pudo registrar el movimiento de stock.");
    }
  };


  // ==========================================================
  // VISTA
  // ==========================================================

  const opcionesUnidadesMedida = unidadesMedida.map((valor) => ({
    value: valor,
    label: valor,
  }));

  return (

    <div className="pagina">
      <Card title="· INSUMOS ·">
        <Button className="btn btn-primary" onClick={abrirNuevoInsumo}>
          + Nuevo insumo
        </Button>

        {error && <div className="mensaje-error">{error}</div>}

        <div className="table-container">
          {cargando ? <p>Cargando insumos...</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Descripción</th>
                  <th>Unidad</th>
                  <th>Entradas</th>
                  <th>Salidas</th>
                  <th>Stock actual</th>
                  <th>Stock mínimo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {insumos.map((insumo) => (
                  <tr key={insumo.idProducto}>
                    <td>{insumo.nombreProducto}</td>
                    <td>{insumo.descripcion || "-"}</td>
                    <td>{insumo.unidadMedida || "-"}</td>
                    <td>+{resumenStock[insumo.idProducto]?.entradas ?? 0}</td>
                    <td>-{resumenStock[insumo.idProducto]?.salidas ?? 0}</td>
                    <td>{insumo.stockActual ?? 0}</td>
                    <td>{insumo.stockMinimo ?? 0}</td>
                    <td>{insumo.activo ? "Activo" : "Inactivo"}</td>
                    <td>
                      <Button variant="secondary" onClick={() => abrirEditarInsumo(insumo)}>
                        Editar
                      </Button>
                      <Button variant="primary" onClick={() => abrirMovimiento(insumo, "ENTRADA")}>
                        + Entrada
                      </Button>
                      <Button variant="warning" onClick={() => abrirMovimiento(insumo, "SALIDA")}>
                        - Salida
                      </Button>
                      <Button
                        variant={insumo.activo ? "warning" : "primary"}
                        onClick={() => cambiarEstado(insumo)}
                      >
                        {insumo.activo ? "Desactivar" : "Activar"}
                      </Button>
                      <Button variant="danger" onClick={() => eliminarInsumo(insumo)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{modoEdicion ? "Editar insumo" : "Nuevo insumo"}</h2>
              <form onSubmit={guardarInsumo} className="form-field columns-2">
                <div className="form-group">
                  <label>Nombre del insumo *</label>
                  <Input value={nombreInsumo} onChange={(e) => setNombreInsumo(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="3" />
                </div>
                <div className="form-group">
                  <label>Unidad de medida *</label>
                  <Select value={unidadMedida} onChange={(e) => setUnidadMedida(e.target.value)} options={opcionesUnidadesMedida} placeholder="Seleccione una unidad" />
                </div>
                <div className="form-group">
                  <label>Stock actual</label>
                  <Input type="number" min="0" step="0.01" value={stockActual} onChange={(e) => setStockActual(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Stock mínimo</label>
                  <Input type="number" min="0" step="0.01" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} />
                </div>
                <label className="checkbox-group">
                  <Input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
                  Insumo activo
                </label>
                {error && <div className="modal-error">{error}</div>}
                <div className="modal-footer">
                  <Button type="button" variant="secondary" onClick={cerrarModal}>Cancelar</Button>
                  <Button type="submit" className="btn btn-primary">
                    {modoEdicion ? "Guardar cambios" : "Crear insumo"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {movimientoInsumo && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{tipoMovimiento === "ENTRADA" ? "Registrar entrada" : "Registrar salida"}</h2>
              <p>{movimientoInsumo.nombreProducto}</p>
              <form onSubmit={registrarMovimiento} className="form-field">
                <div className="form-group">
                  <label>Cantidad *</label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={cantidadMovimiento}
                    onChange={(e) => setCantidadMovimiento(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Motivo</label>
                  <Input
                    value={motivoMovimiento}
                    onChange={(e) => setMotivoMovimiento(e.target.value)}
                    placeholder="Ej. Compra, consumo, ajuste"
                  />
                </div>
                <div className="modal-footer">
                  <Button type="button" variant="secondary" onClick={cerrarMovimiento}>Cancelar</Button>
                  <Button type="submit" className="btn btn-primary">Confirmar</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Insumos;