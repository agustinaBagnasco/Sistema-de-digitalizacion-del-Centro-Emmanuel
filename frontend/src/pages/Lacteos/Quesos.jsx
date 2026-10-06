import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import api from "../../services/api";
import { mensajeError, puedeModificarRegistro } from "../../utils/errores";
import "./Quesos.css";

const FORM_QUARK_VACIO = {
  fecha: "",
  litrosLeche: "",
  cantFrascos: "",
  tiempoElaboracion: "",
  comentario: "",
};

const esProductoQuark = (producto) =>
  producto?.categoria === "QUESO" &&
  (producto?.unidadMedida === "UNIDAD" ||
    producto?.nombreProducto?.toLowerCase().includes("quark"));

export default function Quesos() {
  const [modo, setModo] = useState("QUESO");
  const [formQuark, setFormQuark] = useState(FORM_QUARK_VACIO);
  const [form, setForm] = useState({
    fecha: "",
    cantidad: "",
    litrosLeche: "",
    queso: "",
    comentario: "",
  });

  const [productos, setProductos] = useState([]);
  const [productoLeche, setProductoLeche] = useState(null);
  const [inventarioLeche, setInventarioLeche] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // CARGA INICIAL
  useEffect(() => {
    cargarProductos();
    cargarElaboraciones();
    cargarInventarioLeche();
  }, []);

  // PRODUCTOS - SOLO QUESOS
  const opcionesQuesos = productos
    .filter(
      producto =>
        producto.categoria === "QUESO" &&
        !esProductoQuark(producto) &&
        producto.activo === true
    )
    .map(producto => ({
      value: producto.idProducto,
      label: producto.nombreProducto,
    }));
  const productoQuark = productos.find(
    producto => esProductoQuark(producto) && producto.activo === true
  ) || null;
  const stockLecheDisponible = Math.max(Number(productoLeche?.stockActual) || 0, 0);
  const disponibleQuark = Math.max(
    Number(inventarioLeche?.areas?.find(area => area.destino === "QUARK")?.disponible) || 0,
    0
  );
  const disponibleLecheQuark = Math.min(stockLecheDisponible, disponibleQuark);
  const quesoSeleccionado = productos.find(
    producto => String(producto.idProducto) === String(form.queso),
  );
  const pesoPorHorma = quesoSeleccionado?.pesoHorma == null
    ? null
    : Number(quesoSeleccionado.pesoHorma);
  const manejoEnKilos = quesoSeleccionado?.pesoHorma != null && pesoPorHorma === 0;
  const kilosEstimados = manejoEnKilos
    ? Number(form.cantidad || 0)
    : pesoPorHorma == null
      ? null
      : Number(form.cantidad || 0) * pesoPorHorma;

  async function cargarProductos() {
    try {
      const respuesta = await api.get("/productos");
      setProductos(respuesta.data);
      setProductoLeche(respuesta.data.find(
        producto => producto.categoria === "LECHE" && producto.activo === true
      ) || null);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  async function cargarInventarioLeche() {
    try {
      const respuesta = await api.get("/produccion-leche/inventario");
      setInventarioLeche(respuesta.data);
    } catch (error) {
      console.error("Error al cargar el inventario de leche:", error);
    }
  }

  // CARGAR ELABORACIONES
  async function cargarElaboraciones() {
    try {
      const respuesta = await api.get("/elaboraciones");

      // Solo mostramos elaboraciones de quesos
      const elaboracionesQuesos = respuesta.data.filter(
        elaboracion =>
          elaboracion.productoElaborado?.categoria === "QUESO"
      );

      setRegistros(elaboracionesQuesos);
    } catch (error) {
      console.error("Error al cargar elaboraciones:", error);
    }
  }

  // CAMBIOS DEL FORMULARIO
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // GUARDAR
  async function guardar(e) {
    e.preventDefault();

    const cantidad = Number(form.cantidad);
    const litrosLeche = Number(form.litrosLeche);
    const disponibleQuesos = Number(inventarioLeche?.areas
      ?.find(area => area.destino === "QUESO")?.disponible) || 0;
    if (!Number.isFinite(cantidad) || cantidad <= 0
      || (!manejoEnKilos && !Number.isInteger(cantidad))) {
      alert(manejoEnKilos
        ? "La cantidad de kilos debe ser mayor que cero."
        : "La cantidad de hormas debe ser un número entero mayor que cero.");
      return;
    }

    if (!opcionesQuesos.some((queso) => String(queso.value) === String(form.queso))) {
      alert("Seleccione un tipo de queso activo.");
      return;
    }
    if (!manejoEnKilos && (pesoPorHorma == null || pesoPorHorma <= 0)) {
      alert("No hay un peso estándar configurado para el queso seleccionado.");
      return;
    }
    if (!productoLeche || !Number.isFinite(litrosLeche) || litrosLeche <= 0) {
      alert("Ingrese los litros de leche utilizados en la elaboración.");
      return;
    }
    if (litrosLeche > disponibleQuesos) {
      alert(`Solo hay ${disponibleQuesos} litros disponibles para elaborar quesos.`);
      return;
    }

    try {
      setGuardando(true);
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      if (!usuario?.idUsuario) {
        alert("No se pudo identificar el usuario.");
        return;
      }

      const datos = {
        productoElaborado: {
          idProducto: Number(form.queso),
        },

        fechaElaboracion: form.fecha,

        cantidadProducida: cantidad,
        cantidadHormas: manejoEnKilos ? null : cantidad,
        detalles: [{
          insumoUtilizado: { idProducto: productoLeche.idProducto },
          cantidadUtilizada: litrosLeche,
        }],

        observaciones: form.comentario,

        usuario: {
          idUsuario: usuario.idUsuario,
        },
      };

      if (editando) {
        await api.put(
          `/elaboraciones/${editando.idElaboracion}`,
          datos
        );
      } else {
        await api.post("/elaboraciones", datos);
      }

      await cargarElaboraciones();
      await cargarInventarioLeche();

      limpiarFormulario();

      setEditando(null);

    } catch (error) {
      console.error("Error al guardar elaboración:", error);

      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
      }

      alert(mensajeError(error, "No se pudo guardar la elaboración."));
    } finally {
      setGuardando(false);
    }
  }

  // EDITAR
  function editarRegistro(registro) {
    if (esProductoQuark(registro.productoElaborado)) {
      setFormQuark({
        fecha: registro.fechaElaboracion || "",
        litrosLeche: registro.detalles?.find(
          detalle => detalle.insumoUtilizado?.categoria === "LECHE"
        )?.cantidadUtilizada ?? "",
        cantFrascos: registro.cantidadProducida ?? "",
        tiempoElaboracion: registro.tiempoElaboracion ?? "",
        comentario: registro.observaciones || "",
      });
      setModo("QUARK");
      setEditando(registro);
      return;
    }

    setModo("QUESO");
    setForm({
      fecha: registro.fechaElaboracion || "",
      cantidad: registro.cantidadHormas ?? registro.cantidadProducida ?? "",
      litrosLeche: registro.detalles?.find(
        detalle => detalle.insumoUtilizado?.categoria === "LECHE"
      )?.cantidadUtilizada ?? "",
      queso: registro.productoElaborado?.idProducto || "",
      comentario: registro.observaciones || "",
    });

    setEditando(registro);
  }

  // ELIMINAR
  async function eliminarRegistro(id) {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar esta elaboración?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/elaboraciones/${id}`);

      await cargarElaboraciones();
      await cargarInventarioLeche();

    } catch (error) {
      console.error("Error al eliminar elaboración:", error);

      alert(mensajeError(error, "No se pudo eliminar la elaboración."));
    }
  }

  // LIMPIAR FORMULARIO
  function limpiarFormulario() {
    setForm({
      fecha: "",
      cantidad: "",
      litrosLeche: "",
      queso: "",
      comentario: "",
    });
  }

  // CANCELAR EDICIÓN
  function cancelarEdicion() {
    limpiarFormulario();
    setFormQuark(FORM_QUARK_VACIO);
    setEditando(null);
  }

  function cambiarModo(nuevoModo) {
    if (nuevoModo !== modo) {
      cancelarEdicion();
      setModo(nuevoModo);
    }
  }

  function handleChangeQuark(e) {
    setFormQuark({ ...formQuark, [e.target.name]: e.target.value });
  }

  // GUARDAR QUARK
  async function guardarQuark(e) {
    e.preventDefault();

    const litrosLeche = Number(formQuark.litrosLeche);
    const cantidadFrascos = Number(formQuark.cantFrascos);
    const tiempoElaboracion = Number(formQuark.tiempoElaboracion);

    if (!Number.isFinite(litrosLeche) || litrosLeche <= 0) {
      alert("Ingrese una cantidad de leche mayor que cero.");
      return;
    }
    if (litrosLeche > stockLecheDisponible) {
      alert(`Solo hay ${stockLecheDisponible} litros de leche disponibles.`);
      return;
    }
    if (litrosLeche > disponibleQuark) {
      alert(`Solo hay ${disponibleQuark} litros disponibles para Quark.`);
      return;
    }
    if (!Number.isInteger(cantidadFrascos) || cantidadFrascos <= 0) {
      alert("Ingrese una cantidad de frascos mayor que cero.");
      return;
    }
    if (!Number.isFinite(tiempoElaboracion) || tiempoElaboracion < 0) {
      alert("El tiempo de elaboración no puede ser negativo.");
      return;
    }
    if (!productoQuark) {
      alert("No se encontró el producto Quark.");
      return;
    }
    if (!productoLeche) {
      alert("No se encontró el producto Leche.");
      return;
    }

    let usuario = null;
    try {
      usuario = JSON.parse(localStorage.getItem("usuario"));
    } catch (error) {
      console.error("Error leyendo usuario:", error);
    }
    if (!usuario?.idUsuario) {
      alert("No se encontró el usuario logueado.");
      return;
    }

    const datos = {
      productoElaborado: { idProducto: productoQuark.idProducto },
      fechaElaboracion: formQuark.fecha,
      tiempoElaboracion,
      cantidadProducida: cantidadFrascos,
      cantidadFrascos1kg: null,
      cantidadFrascos420g: null,
      usuario: { idUsuario: usuario.idUsuario },
      observaciones: formQuark.comentario,
      detalles: [{
        insumoUtilizado: { idProducto: productoLeche.idProducto },
        cantidadUtilizada: litrosLeche,
      }],
    };

    try {
      setGuardando(true);
      if (editando) {
        await api.put(`/elaboraciones/${editando.idElaboracion}`, datos);
      } else {
        await api.post("/elaboraciones", datos);
      }

      await cargarElaboraciones();
      await cargarInventarioLeche();
      await cargarProductos();
      cancelarEdicion();
      alert("Elaboración de Quark guardada correctamente.");
    } catch (error) {
      console.error("Error al guardar elaboración:", error);
      alert(mensajeError(error, "Error al guardar la elaboración."));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="pagina">

      <Card title={modo === "QUARK"
        ? "· REGISTRO DE ELABORACION DE QUARK ·"
        : "· REGISTRO DE ELABORACION DE QUESOS ·"}>

        <div className="quesos-tabs" role="tablist" aria-label="Tipo de elaboración">
          <button
            type="button"
            role="tab"
            aria-selected={modo === "QUESO"}
            className={`quesos-tab ${modo === "QUESO" ? "quesos-tab--activo" : ""}`}
            onClick={() => cambiarModo("QUESO")}
          >
            Quesos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modo === "QUARK"}
            className={`quesos-tab ${modo === "QUARK" ? "quesos-tab--activo" : ""}`}
            onClick={() => cambiarModo("QUARK")}
          >
            Quark
          </button>
        </div>

        {modo === "QUARK" && (
          <form onSubmit={guardarQuark} className="form-field columns-2">

            <div className="input-group">
              <label>Fecha</label>
              <Input
                type="date"
                name="fecha"
                value={formQuark.fecha}
                onChange={handleChangeQuark}
                required
              />
            </div>

            <div className="input-group">
              <label>Leche (Lts)</label>
              <small>Disponibles para Quark: {disponibleQuark} L</small>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max={disponibleLecheQuark}
                name="litrosLeche"
                value={formQuark.litrosLeche}
                onChange={handleChangeQuark}
                required
              />
            </div>

            <div className="input-group">
              <label>Cantidad de Frascos</label>
              <Input
                type="number"
                min="1"
                step="1"
                name="cantFrascos"
                value={formQuark.cantFrascos}
                onChange={handleChangeQuark}
                required
              />
            </div>

            <div className="input-group">
              <label>Tiempo de elaboración (min)</label>
              <Input
                type="number"
                min="0"
                name="tiempoElaboracion"
                value={formQuark.tiempoElaboracion}
                onChange={handleChangeQuark}
                required
              />
            </div>

            <div className="input-group">
              <label>Comentario</label>
              <Textarea
                name="comentario"
                value={formQuark.comentario}
                onChange={handleChangeQuark}
                placeholder="Ingrese observaciones..."
              />
            </div>

            <div className="form-button-container">
              <Button type="submit" className="btn btn-primary" disabled={guardando}>
                {guardando ? "Guardando..." : editando ? "Actualizar" : "Guardar"}
              </Button>
              {editando && (
                <Button type="button" variant="secondary" onClick={cancelarEdicion}>
                  Cancelar
                </Button>
              )}
            </div>

          </form>
        )}

        {modo === "QUESO" && (
        <form
          onSubmit={guardar}
          className="form-field columns-2"
        >

          {/* FECHA */}
          <div className="input-group">
            <label>Fecha</label>

            <Input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>


          {/* TIPO DE QUESO */}
          <div className="input-group">
            <label>Tipo de queso</label>

            <Select
              name="queso"
              value={form.queso}
              onChange={handleChange}
              options={opcionesQuesos}
              placeholder="Seleccione un tipo de queso"
              required
            />
          </div>


          {/* CANTIDAD */}
          <div className="input-group">

            <label>Cantidad ({manejoEnKilos ? "kg" : "hormas"})</label>

            <Input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              min={manejoEnKilos ? "0.01" : "1"}
              step={manejoEnKilos ? "0.01" : "1"}
              required
            />
            {manejoEnKilos ? (
              <small>Este queso se registra únicamente en kilogramos.</small>
            ) : pesoPorHorma == null || pesoPorHorma <= 0 ? (
              form.queso && (
                <small>No hay un peso estándar configurado para este queso.</small>
              )
            ) : (
              <small>
                Estándar: {pesoPorHorma.toLocaleString("es-AR")} kg por horma.
                {" "}Total producido: {kilosEstimados.toLocaleString("es-AR")} kg.
              </small>
            )}
          </div>

          <div className="input-group">
            <label>Leche utilizada (litros)</label>
            <Input
              type="number"
              name="litrosLeche"
              value={form.litrosLeche}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
            />
            <small>
              Disponibles para queso: {inventarioLeche?.areas
                ?.find(area => area.destino === "QUESO")?.disponible ?? 0} L
            </small>
          </div>


          {/* COMENTARIO */}
          <div className="input-group">

            <label>Comentario</label>

            <Textarea
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              placeholder="Ingrese observaciones..."
            />

          </div>


          {/* BOTONES */}
          <div className="form-button-container">

            <Button
              type="submit"
              className="btn btn-primary"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : editando
                  ? "Actualizar"
                  : "Guardar"}
            </Button>

            {editando && (
              <Button
                type="button"
                variant="secondary"
                onClick={cancelarEdicion}
              >
                Cancelar
              </Button>
            )}

          </div>

        </form>
        )}

        <br />
        <hr />


        {/* TABLA */}

        <div className="table-container">

          <table className="table">

            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producción</th>
                <th>Tipo de queso</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>
            </thead>


            <tbody>

              {registros.length === 0 ? (

                <tr>
                  <td colSpan="5">
                    No hay elaboraciones registradas.
                  </td>
                </tr>

              ) : (

                registros.map(registro => (

                  <tr key={registro.idElaboracion}>

                    <td>
                      {registro.fechaElaboracion}
                    </td>

                    <td>
                      {registro.cantidadHormas != null
                        ? `${registro.cantidadHormas} horma(s) · ${Number(registro.cantidadProducida)
                          .toLocaleString("es-AR")} kg`
                        : esProductoQuark(registro.productoElaborado)
                          ? `${registro.cantidadProducida} frasco(s)${registro.tiempoElaboracion != null
                            ? ` · ${registro.tiempoElaboracion} min` : ""}`
                          : registro.productoElaborado?.pesoHorma === 0
                          ? `${Number(registro.cantidadProducida).toLocaleString("es-AR")} kg`
                          : `${registro.cantidadProducida} (registro histórico sin conversión)`}
                    </td>

                    <td>
                      {registro.productoElaborado?.nombreProducto}
                    </td>

                    <td>
                      {registro.observaciones}
                    </td>

                    <td>

                      <div className="table-actions">

                        <Button
                          variant="secondary"
                          disabled={!puedeModificarRegistro(registro)}
                          onClick={() =>
                            editarRegistro(registro)
                          }
                        >
                          Editar
                        </Button>

                        <Button
                          variant="danger"
                          disabled={!puedeModificarRegistro(registro)}
                          onClick={() =>
                            eliminarRegistro(
                              registro.idElaboracion
                            )
                          }
                        >
                          Eliminar
                        </Button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </Card>

    </div>
  );
}
