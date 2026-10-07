import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import "../../components/ui/Forms.css";
import api from "../../services/api";
import { mensajeError, puedeModificarRegistro } from "../../utils/errores";
import { etiquetaInsumo } from "../../utils/formatNumber";

function normalizarTexto(texto) {
  return texto
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obtenerPresentacion(nombre) {
  const texto = normalizarTexto(nombre) || "";
  if (/(?:^|\D)(?:1\s*kg|1000\s*g)(?:\D|$)/i.test(texto)) {
    return "1kg";
  }
  if (/(?:420\s*g|0[,.]?420\s*kg|1\s*\/\s*2\s*kg)/i.test(texto)) {
    return "420g";
  }
  return null;
}

function obtenerNombreBase(nombre) {
  return (nombre || "Producto")
    .replace(/\s*(?:1\s*kg|1000\s*g|420\s*g|0[,.]?420\s*kg|1\s*\/\s*2\s*kg)\s*$/i, "")
    .trim();
}

function obtenerNombreFruta(nombreProducto) {
  return normalizarTexto(nombreProducto)
    ?.replace(/^(?:dulce|mermelada)\s+de\s+/i, "")
    .trim();
}

export default function Mermeladas() {

  const [form, setForm] = useState({
    fecha: "",
    productoElaborado: "",
    fruta: "",
    cantidadFrutaTotal: "",
    frutaDescartada: "",
    frutaUtilizada: "",
    azucar: "",
    cantidadAzucar: "",
    tiempoElaboracion: "",
    tiempoCoccion: "",
    cantidadFrascos1kg: "",
    cantidadFrascos420: "",
    comentario: "",
  });

  const [productos, setProductos] = useState([]);
  const [insumosFruta, setInsumosFruta] = useState([]);
  const [insumosAzucar, setInsumosAzucar] = useState([]);

  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarProductos();
    cargarElaboraciones();
  }, []);

  // CARGAR PRODUCTOS
  async function cargarProductos() {
    try {
      const respuesta = await api.get("/productos");

      const lista = respuesta.data;

      // Productos elaborados de categoría MERMELADA
      const productosMermelada = lista.filter(
        producto =>
          producto.activo &&
          producto.tipo === "PRODUCTO" &&
          producto.categoria === "MERMELADA"
      );

      // Frutas que pueden utilizarse como insumo
      const frutas = lista.filter(
        producto =>
          producto.activo &&
          producto.tipo === "INSUMO" &&
          producto.categoria === "FRUTA"
      );

      // Azúcar
      const azucar = lista.filter(
        producto =>
          producto.activo &&
          producto.tipo === "INSUMO" &&
          normalizarTexto(producto.nombreProducto).includes("azucar")
      );

      setProductos(productosMermelada);
      setInsumosFruta(frutas);
      setInsumosAzucar(azucar);

    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  // CARGAR ELABORACIONES
  async function cargarElaboraciones() {
    try {
      const respuesta = await api.get("/elaboraciones");

      const mermeladas = respuesta.data.filter(
        elaboracion =>
          elaboracion.productoElaborado?.categoria === "MERMELADA"
      );

      setRegistros(mermeladas);

    } catch (error) {
      console.error("Error al cargar elaboraciones:", error);
    }
  }

  // OPCIONES DE SELECT
  const gruposMermelada = productos.reduce((grupos, producto) => {
    const nombreBase = obtenerNombreBase(producto.nombreProducto);
    const clave = normalizarTexto(nombreBase);
    const grupo = grupos.get(clave) || {
      clave,
      nombre: nombreBase,
      producto1kg: null,
      producto420g: null,
    };
    const presentacion = obtenerPresentacion(producto.nombreProducto);
    if (presentacion === "1kg") grupo.producto1kg = producto;
    if (presentacion === "420g") grupo.producto420g = producto;
    grupos.set(clave, grupo);
    return grupos;
  }, new Map());

  const opcionesProductos = Array.from(gruposMermelada.values()).map(grupo => ({
    value: grupo.clave,
    label: grupo.nombre,
  }));

  const grupoSeleccionado = gruposMermelada.get(form.productoElaborado);
  const nombreFrutaEsperada = obtenerNombreFruta(grupoSeleccionado?.nombre);
  const frutaAutomatica = insumosFruta.find((insumo) => {
    const nombreFruta = normalizarTexto(insumo.nombreProducto);
    return nombreFruta && nombreFrutaEsperada && (
      nombreFruta === nombreFrutaEsperada ||
      nombreFrutaEsperada.includes(nombreFruta)
    );
  });

  const opcionesFrutas = (frutaAutomatica ? [frutaAutomatica] : insumosFruta).map(insumo => ({
    value: insumo.idProducto,
    label: etiquetaInsumo(insumo),
  }));

  const opcionesAzucar = insumosAzucar.map(insumo => ({
    value: insumo.idProducto,
    label: etiquetaInsumo(insumo),
  }));

  const frutaUtilizadaKg = parseFloat(form.frutaUtilizada) || 0;
  const frascos1kgActuales = parseFloat(form.cantidadFrascos1kg) || 0;
  const frascos420Actuales = parseFloat(form.cantidadFrascos420) || 0;
  const maxFrascos1kg = Math.max(
    Math.floor((frutaUtilizadaKg - frascos420Actuales * 0.420) + 0.000001),
    0
  );
  const maxFrascos420 = Math.max(
    Math.floor(((frutaUtilizadaKg - frascos1kgActuales) / 0.420) + 0.000001),
    0
  );

  // CAMBIOS DEL FORMULARIO
  function handleChange(e) {
    const { name, value } = e.target;

    setForm(prev => {
      const nuevoForm = {
        ...prev,
        [name]: value,
      };

      if (name === "productoElaborado") {
        const grupo = gruposMermelada.get(value);
        const nombreFruta = obtenerNombreFruta(grupo?.nombre);
        const fruta = insumosFruta.find((insumo) => {
          const nombreInsumo = normalizarTexto(insumo.nombreProducto);
          return nombreInsumo && nombreFruta && (
            nombreInsumo === nombreFruta || nombreFruta.includes(nombreInsumo)
          );
        });
        nuevoForm.fruta = fruta?.idProducto || "";
      }

      if (
        name === "cantidadFrutaTotal" ||
        name === "frutaDescartada"
      ) {
        const total =
          parseFloat(nuevoForm.cantidadFrutaTotal) || 0;

        const descartada =
          parseFloat(nuevoForm.frutaDescartada) || 0;

        nuevoForm.frutaUtilizada = Math.max(
          total - descartada,
          0
        );
      }

      if (name === "cantidadFrascos1kg" || name === "cantidadFrascos420") {
        const frutaDisponible = parseFloat(nuevoForm.frutaUtilizada) || 0;
        const frascos1kg = name === "cantidadFrascos1kg"
          ? parseFloat(value) || 0
          : parseFloat(nuevoForm.cantidadFrascos1kg) || 0;
        const frascos420 = name === "cantidadFrascos420"
          ? parseFloat(value) || 0
          : parseFloat(nuevoForm.cantidadFrascos420) || 0;
        const pesoSolicitado = frascos1kg + (frascos420 * 0.420);

        if (pesoSolicitado > frutaDisponible) {
          nuevoForm[name] = name === "cantidadFrascos1kg"
            ? String(Math.max(Math.floor(frutaDisponible - frascos420 * 0.420), 0))
            : String(Math.max(Math.floor((frutaDisponible - frascos1kg) / 0.420), 0));
        }
      }

      return nuevoForm;
    });
  }

  // OBTENER USUARIO LOGUEADO
  function obtenerUsuarioId() {

    const usuarioGuardado =
      localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      return null;
    }

    try {
      const usuario = JSON.parse(usuarioGuardado);

      return usuario.idUsuario;

    } catch {
      return null;
    }
  }

  // GUARDAR
  async function guardar(e) {
    e.preventDefault();

    const usuarioId = obtenerUsuarioId();

    if (!usuarioId) {
      alert(
        "No se pudo identificar el usuario logueado."
      );
      return;
    }

    if (!form.productoElaborado) {
      alert("Seleccione el producto elaborado.");
      return;
    }

    if (!form.fruta) {
      alert("Seleccione la fruta utilizada.");
      return;
    }

    const grupoMermelada = gruposMermelada.get(form.productoElaborado);
    if (!grupoMermelada) {
      alert("No se encontró la familia de productos elaborados seleccionada.");
      return;
    }

    try {

      setCargando(true);

      const cantidadFrascos1kg =
        parseFloat(form.cantidadFrascos1kg) || 0;

      const cantidadFrascos420 =
        parseFloat(form.cantidadFrascos420) || 0;

      if (cantidadFrascos1kg > 0 && !grupoMermelada.producto1kg) {
        alert("No existe una presentación de 1 kg para este dulce.");
        return;
      }
      if (cantidadFrascos420 > 0 && !grupoMermelada.producto420g) {
        alert("No existe una presentación de 1/2 kg para este dulce.");
        return;
      }

      const frutaUtilizada =
        parseFloat(form.frutaUtilizada) || 0;

      const frutaRequerida =
        cantidadFrascos1kg + (cantidadFrascos420 * 0.420);

      if (frutaRequerida > frutaUtilizada + 0.000001) {
        alert(
          `La producción requiere ${frutaRequerida.toFixed(3)} kg de fruta, ` +
          `pero solo hay ${frutaUtilizada.toFixed(3)} kg utilizables.`
        );
        return;
      }

      const cantidadProducida =
        cantidadFrascos1kg + cantidadFrascos420;

      const horasElaboracion =
        parseFloat(form.tiempoElaboracion) || 0;

      const horasCoccion =
        parseFloat(form.tiempoCoccion) || 0;

      const tiempoTotalMinutos =
        Math.round(
          (horasElaboracion + horasCoccion) * 60
        );

      const observaciones = `
Fruta total: ${form.cantidadFrutaTotal} kg.
Fruta descartada: ${form.frutaDescartada} kg.
Fruta utilizada: ${form.frutaUtilizada} kg.
Azúcar utilizada: ${form.cantidadAzucar || 0} kg.
Frascos 1 kg: ${cantidadFrascos1kg}.
Frascos 420 g: ${cantidadFrascos420}.
${form.comentario || ""}
      `.trim();

      const elaboracion = {

        productoElaborado: {
          idProducto: (grupoMermelada.producto1kg || grupoMermelada.producto420g).idProducto
        },

        productoElaborado1kg: cantidadFrascos1kg > 0
          ? { idProducto: grupoMermelada.producto1kg.idProducto }
          : null,

        productoElaborado420g: cantidadFrascos420 > 0
          ? { idProducto: grupoMermelada.producto420g.idProducto }
          : null,

        fechaElaboracion: form.fecha,

        tiempoElaboracion: tiempoTotalMinutos,

        cantidadProducida: cantidadProducida,

        cantidadFrascos1kg: cantidadFrascos1kg,

        cantidadFrascos420g: cantidadFrascos420,

        usuario: {
          idUsuario: usuarioId
        },

        observaciones: observaciones,

        detalles: [
          {
            insumoUtilizado: {
              idProducto: Number(form.fruta)
            },

            cantidadUtilizada:
              parseFloat(form.frutaUtilizada) || 0
          }
        ]
      };

      // Agregar azúcar si fue seleccionada
      if (form.azucar && insumosAzucar.length > 0) {

        const azucarSeleccionada =
          insumosAzucar.find(
            insumo =>
              String(insumo.idProducto) ===
              String(form.azucar)
          );

        if (azucarSeleccionada) {

          elaboracion.detalles.push({
            insumoUtilizado: {
              idProducto:
                Number(form.azucar)
            },

            cantidadUtilizada:
              parseFloat(form.cantidadAzucar) || 0
          });

        }
      }

      // CREAR
      if (editando === null) {

        await api.post(
          "/elaboraciones",
          elaboracion
        );

      }

      // ACTUALIZAR
      else {

        await api.put(
          `/elaboraciones/${editando.idElaboracion}`,
          elaboracion
        );

      }

      await cargarElaboraciones();

      limpiarFormulario();

      alert(
        editando === null
          ? "Elaboración guardada correctamente."
          : "Elaboración actualizada correctamente."
      );

    } catch (error) {

      console.error(
        "Error al guardar elaboración:",
        error
      );

      console.error(
        "Respuesta del servidor:",
        error.response?.data
      );

      alert(mensajeError(error, "No se pudo guardar la elaboración."));

    } finally {

      setCargando(false);

    }
  }

  // LIMPIAR
  function limpiarFormulario() {

    setForm({
      fecha: "",
      productoElaborado: "",
      fruta: "",
      cantidadFrutaTotal: "",
      frutaDescartada: "",
      frutaUtilizada: "",
      azucar: "",
      cantidadAzucar: "",
      tiempoElaboracion: "",
      tiempoCoccion: "",
      cantidadFrascos1kg: "",
      cantidadFrascos420: "",
      comentario: "",
    });

    setEditando(null);
  }

  // EDITAR
  function editarRegistro(registro) {

    const detalleFruta =
      registro.detalles?.find(
        detalle =>
          detalle.insumoUtilizado?.categoria === "FRUTA"
      );

    const detalleAzucar =
      registro.detalles?.find(
        detalle =>
          normalizarTexto(detalle.insumoUtilizado?.nombreProducto).includes("azucar")
      );

    setForm({
      fecha:
        registro.fechaElaboracion || "",

      productoElaborado:
        normalizarTexto(obtenerNombreBase(registro.productoElaborado?.nombreProducto)) || "",

      fruta:
        detalleFruta?.insumoUtilizado?.idProducto || "",

      cantidadFrutaTotal: "",
      frutaDescartada: "",

      frutaUtilizada:
        detalleFruta?.cantidadUtilizada || "",

      azucar:
        detalleAzucar?.insumoUtilizado?.idProducto || "",

      cantidadAzucar:
        detalleAzucar?.cantidadUtilizada || "",

      tiempoElaboracion:
        registro.tiempoElaboracion
          ? registro.tiempoElaboracion / 60
          : "",

      tiempoCoccion: "",

      cantidadFrascos1kg: "",
      cantidadFrascos420:
        registro.cantidadProducida || "",

      comentario:
        registro.observaciones || "",
    });

    setEditando(registro);
  }

  // ELIMINAR
  async function eliminarRegistro(registro) {

    const confirmar = window.confirm(
      "¿Está seguro de eliminar esta elaboración?"
    );

    if (!confirmar) {
      return;
    }

    try {

      await api.delete(
        `/elaboraciones/${registro.idElaboracion}`
      );

      await cargarElaboraciones();

    } catch (error) {

      console.error(
        "Error al eliminar elaboración:",
        error
      );

      alert(mensajeError(error, "No se pudo eliminar la elaboración."));
    }
  }

  // RENDER
  return (
    <div className="pagina">

      <Card title="· REGISTRO DE ELABORACION DE MERMELADAS ·">

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

          {/* PRODUCTO ELABORADO */}

          <div className="input-group">
            <label>Producto elaborado</label>

            <Select
              name="productoElaborado"
              value={form.productoElaborado}
              onChange={handleChange}
              options={opcionesProductos}
              placeholder="Seleccione la mermelada"
              required
            />
          </div>

          {/* FRUTA */}

          <div className="input-group">
            <label>Fruta</label>

            <Select
              name="fruta"
              value={form.fruta}
              onChange={handleChange}
              options={opcionesFrutas}
              placeholder={frutaAutomatica ? "Fruta seleccionada automáticamente" : "Seleccione una fruta"}
              disabled={Boolean(frutaAutomatica)}
              required
            />
          </div>

          {/* FRUTA TOTAL */}

          <div className="input-group">
            <label>
              Cantidad de fruta total (kg)
            </label>

            <Input
              type="number"
              step="0.01"
              name="cantidadFrutaTotal"
              value={form.cantidadFrutaTotal}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCARTE */}

          <div className="input-group">
            <label>
              Fruta descartada (kg)
            </label>

            <Input
              type="number"
              step="0.01"
              name="frutaDescartada"
              value={form.frutaDescartada}
              onChange={handleChange}
              required
            />
          </div>

          {/* UTILIZADA */}

          <div className="input-group">

            <label>
              Fruta utilizada (kg)
            </label>

            <Input
              type="number"
              step="0.01"
              name="frutaUtilizada"
              value={form.frutaUtilizada}
              readOnly
              style={{
                backgroundColor: "#e9ecef",
                cursor: "not-allowed"
              }}
            />

          </div>

          {/* AZUCAR */}

          <div className="input-group">

            <label>Insumos</label>

            <Select
              name="azucar"
              value={form.azucar}
              onChange={handleChange}
              options={opcionesAzucar}
              placeholder="Seleccione insumo"
            />

          </div>

          {/* CANTIDAD AZUCAR */}

          <div className="input-group">

            <label>
              Cantidad de azúcar (kg)
            </label>

            <Input
              type="number"
              step="0.01"
              name="cantidadAzucar"
              value={form.cantidadAzucar}
              onChange={handleChange}
            />

          </div>

          {/* TIEMPO ELABORACION */}

          <div className="input-group">

            <label>
              Tiempo de elaboración (horas)
            </label>

            <Input
              type="number"
              step="0.01"
              name="tiempoElaboracion"
              value={form.tiempoElaboracion}
              onChange={handleChange}
              required
            />

          </div>

          {/* TIEMPO COCCION */}

          <div className="input-group">

            <label>
              Tiempo de cocción (horas)
            </label>

            <Input
              type="number"
              step="0.01"
              name="tiempoCoccion"
              value={form.tiempoCoccion}
              onChange={handleChange}
              required
            />

          </div>

          {/* FRASCOS 1 KG */}

          <div className="input-group">

            <label>
              Frascos 1 kg
            </label>

            <Input
              type="number"
              name="cantidadFrascos1kg"
              value={form.cantidadFrascos1kg}
              onChange={handleChange}
              min="0"
              max={maxFrascos1kg}
            />

            <small>Máximo disponible: {maxFrascos1kg} frascos</small>

          </div>

          {/* FRASCOS 420 */}

          <div className="input-group">

            <label>
              Frascos 420 g
            </label>

            <Input
              type="number"
              name="cantidadFrascos420"
              value={form.cantidadFrascos420}
              onChange={handleChange}
              min="0"
              max={maxFrascos420}
            />

            <small>Máximo disponible: {maxFrascos420} frascos</small>

          </div>

          {/* OBSERVACIONES */}

          <div className="input-group">

            <label>
              Comentario
            </label>

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
              variant="primary"
              disabled={cargando}
            >
              {cargando
                ? "Guardando..."
                : editando
                  ? "Actualizar"
                  : "Guardar"}
            </Button>

            {editando && (
              <Button
                type="button"
                variant="secondary"
                onClick={limpiarFormulario}
              >
                Cancelar
              </Button>
            )}

          </div>

        </form>

        <br />

        <hr />

        {/* TABLA */}

        <div className="table-container">

          <table className="table">

            <thead>

              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Cantidad producida</th>
                <th>Tiempo</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {registros.length === 0 ? (

                <tr>
                  <td colSpan="6">
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
                      {
                        registro.productoElaborado
                          ?.nombreProducto
                      }
                    </td>

                    <td>
                      {registro.cantidadProducida}
                    </td>

                    <td>
                      {registro.tiempoElaboracion} min
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
                            eliminarRegistro(registro)
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





