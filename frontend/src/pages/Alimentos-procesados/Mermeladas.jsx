import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import "../../components/ui/Forms.css";
import api from "../../services/api";

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

  // =========================================================
  // CARGAR PRODUCTOS
  // =========================================================

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

  // =========================================================
  // CARGAR ELABORACIONES
  // =========================================================

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

  // =========================================================
  // OPCIONES DE SELECT
  // =========================================================

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
    label: insumo.nombreProducto,
  }));

  const opcionesAzucar = insumosAzucar.map(insumo => ({
    value: insumo.idProducto,
    label: insumo.nombreProducto,
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

  // =========================================================
  // CAMBIOS DEL FORMULARIO
  // =========================================================

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

  // =========================================================
  // OBTENER USUARIO LOGUEADO
  // =========================================================

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

  // =========================================================
  // GUARDAR
  // =========================================================

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

      // =====================================================
      // CREAR
      // =====================================================

      if (editando === null) {

        await api.post(
          "/elaboraciones",
          elaboracion
        );

      }

      // =====================================================
      // ACTUALIZAR
      // =====================================================

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

      alert(
        "No se pudo guardar la elaboración."
      );

    } finally {

      setCargando(false);

    }
  }

  // =========================================================
  // LIMPIAR
  // =========================================================

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

  // =========================================================
  // EDITAR
  // =========================================================

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

  // =========================================================
  // ELIMINAR
  // =========================================================

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

      alert(
        "No se pudo eliminar la elaboración."
      );
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

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

            <label>Azúcar</label>

            <Select
              name="azucar"
              value={form.azucar}
              onChange={handleChange}
              options={opcionesAzucar}
              placeholder="Seleccione azúcar"
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
                          onClick={() =>
                            editarRegistro(registro)
                          }
                        >
                          Editar
                        </Button>

                        <Button
                          variant="danger"
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





// import { useEffect, useState } from "react";

// import Card from "../../components/ui/Card";
// import Select from "../../components/ui/Select";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";
// import Textarea from "../../components/ui/Textarea";
// import FormField from "../../components/ui/FormField";

// import api from "../../services/api";

// export default function Mermeladas() {

//   const [productos, setProductos] = useState([]);
//   const [registros, setRegistros] = useState([]);
//   const [editando, setEditando] = useState(null);

//   const [form, setForm] = useState({
//     fecha: "",
//     producto: "",
//     fruta: "",
//     cantidadFrutaTotal: "",
//     frutaDescartada: "",
//     cantidadAzucar: "",
//     tiempoElaboracion: "",
//     tiempoCoccion: "",
//     cantidadFrascos1kg: "",
//     cantidadFrascos420g: "",
//     comentario: "",
//   });

//   // --------------------------------------------------
//   // CARGAR PRODUCTOS
//   // --------------------------------------------------

//   useEffect(() => {
//     cargarProductos();
//     cargarElaboraciones();
//   }, []);

//   const cargarProductos = async () => {
//     try {
//       const response = await api.get("/productos");
//       setProductos(response.data);
//     } catch (error) {
//       console.error("Error al cargar productos:", error);
//     }
//   };

//   // --------------------------------------------------
//   // CARGAR ELABORACIONES
//   // --------------------------------------------------

//   const cargarElaboraciones = async () => {
//     try {
//       const response = await api.get("/elaboraciones");

//       const elaboracionesMermelada = response.data.filter(
//         (elaboracion) =>
//           elaboracion.productoElaborado?.categoria === "MERMELADA"
//       );

//       setRegistros(elaboracionesMermelada);

//     } catch (error) {
//       console.error("Error al cargar elaboraciones:", error);
//     }
//   };

//   // --------------------------------------------------
//   // PRODUCTOS DISPONIBLES
//   // --------------------------------------------------

//   const productosMermelada = productos.filter(
//     (producto) =>
//       producto.activo &&
//       producto.tipo === "PRODUCTO" &&
//       producto.categoria === "MERMELADA"
//   );

//   const frutas = productos.filter(
//     (producto) =>
//       producto.activo &&
//       producto.tipo === "INSUMO" &&
//       producto.categoria === "FRUTA"
//   );

//   const azucar = productos.find(
//     (producto) =>
//       producto.activo &&
//       producto.tipo === "INSUMO" &&
//       producto.nombreProducto?.toLowerCase().includes("azúcar")
//   );

//   // --------------------------------------------------
//   // CAMBIOS DEL FORMULARIO
//   // --------------------------------------------------

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // --------------------------------------------------
//   // CÁLCULOS
//   // --------------------------------------------------

//   const cantidadFrutaUtilizada =
//     (Number(form.cantidadFrutaTotal) || 0) -
//     (Number(form.frutaDescartada) || 0);

//   const cantidadProducida =
//     (Number(form.cantidadFrascos1kg) || 0) * 1 +
//     (Number(form.cantidadFrascos420g) || 0) * 0.420;

//   // --------------------------------------------------
//   // OBTENER USUARIO
//   // --------------------------------------------------

//   const obtenerUsuario = () => {
//     try {
//       const usuarioGuardado = localStorage.getItem("usuario");

//       if (!usuarioGuardado) {
//         return null;
//       }

//       return JSON.parse(usuarioGuardado);

//     } catch (error) {
//       console.error("Error al obtener usuario:", error);
//       return null;
//     }
//   };

//   // --------------------------------------------------
//   // GUARDAR
//   // --------------------------------------------------

//   const guardar = async (e) => {
//     e.preventDefault();

//     const usuario = obtenerUsuario();

//     if (!usuario?.idUsuario) {
//       alert("No se pudo identificar al usuario.");
//       return;
//     }

//     if (!form.producto) {
//       alert("Debe seleccionar el producto elaborado.");
//       return;
//     }

//     if (!form.fecha) {
//       alert("Debe ingresar la fecha.");
//       return;
//     }

//     if (cantidadProducida <= 0) {
//       alert("Debe ingresar al menos una cantidad de frascos.");
//       return;
//     }

//     if (cantidadFrutaUtilizada < 0) {
//       alert("La fruta descartada no puede ser mayor que la fruta total.");
//       return;
//     }

//     // Tiempo total en minutos
//     const horas = Number(form.tiempoElaboracion) || 0;
//     const minutosCoccion = Number(form.tiempoCoccion) || 0;

//     const tiempoTotalMinutos =
//       horas * 60 + minutosCoccion;

//     // -----------------------------------------------
//     // DETALLES / INSUMOS
//     // -----------------------------------------------

//     const detalles = [];

//     // Fruta
//     if (form.fruta && cantidadFrutaUtilizada > 0) {
//       detalles.push({
//         insumoUtilizado: {
//           idProducto: Number(form.fruta),
//         },
//         cantidadUtilizada: cantidadFrutaUtilizada,
//       });
//     }

//     // Azúcar
//     if (azucar && Number(form.cantidadAzucar) > 0) {
//       detalles.push({
//         insumoUtilizado: {
//           idProducto: azucar.idProducto,
//         },
//         cantidadUtilizada: Number(form.cantidadAzucar),
//       });
//     }

//     // -----------------------------------------------
//     // OBJETO PARA BACKEND
//     // -----------------------------------------------

//     const elaboracion = {
//       productoElaborado: {
//         idProducto: Number(form.producto),
//       },

//       fechaElaboracion: form.fecha,

//       tiempoElaboracion: tiempoTotalMinutos,

//       cantidadProducida: cantidadProducida,

//       cantidadFrascos1kg:
//         Number(form.cantidadFrascos1kg) || 0,

//       cantidadFrascos420g:
//         Number(form.cantidadFrascos420g) || 0,

//       usuario: {
//         idUsuario: usuario.idUsuario,
//       },

//       observaciones: form.comentario,

//       detalles: detalles,
//     };

//     try {

//       if (editando) {

//         await api.put(
//           `/elaboraciones/${editando}`,
//           elaboracion
//         );

//         alert("Elaboración actualizada correctamente.");

//       } else {

//         await api.post(
//           "/elaboraciones",
//           elaboracion
//         );

//         alert("Elaboración registrada correctamente.");
//       }

//       limpiarFormulario();
//       cargarElaboraciones();

//     } catch (error) {

//       console.error(
//         "Error al guardar elaboración:",
//         error.response?.data || error
//       );

//       alert("No se pudo guardar la elaboración.");
//     }
//   };

//   // --------------------------------------------------
//   // EDITAR
//   // --------------------------------------------------

//   const editar = (registro) => {

//     const detalles = registro.detalles || [];

//     const detalleFruta = detalles.find(
//       (detalle) =>
//         detalle.insumoUtilizado?.categoria === "FRUTA"
//     );

//     const detalleAzucar = detalles.find(
//       (detalle) =>
//         detalle.insumoUtilizado?.nombreProducto
//           ?.toLowerCase()
//           .includes("azúcar")
//     );

//     const minutosTotales =
//       registro.tiempoElaboracion || 0;

//     const horas = Math.floor(minutosTotales / 60);
//     const minutos = minutosTotales % 60;

//     setForm({
//       fecha: registro.fechaElaboracion || "",

//       producto:
//         registro.productoElaborado?.idProducto || "",

//       fruta:
//         detalleFruta?.insumoUtilizado?.idProducto || "",

//       cantidadFrutaTotal:
//         detalleFruta?.cantidadUtilizada || "",

//       frutaDescartada: "",

//       cantidadAzucar:
//         detalleAzucar?.cantidadUtilizada || "",

//       tiempoElaboracion: horas,

//       tiempoCoccion: minutos,

//       cantidadFrascos1kg:
//         registro.cantidadFrascos1kg || "",

//       cantidadFrascos420g:
//         registro.cantidadFrascos420g || "",

//       comentario:
//         registro.observaciones || "",
//     });

//     setEditando(registro.idElaboracion);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // --------------------------------------------------
//   // ELIMINAR
//   // --------------------------------------------------

//   const eliminar = async (id) => {

//     const confirmar = window.confirm(
//       "¿Está seguro de eliminar esta elaboración?"
//     );

//     if (!confirmar) return;

//     try {

//       await api.delete(`/elaboraciones/${id}`);

//       cargarElaboraciones();

//     } catch (error) {

//       console.error(
//         "Error al eliminar elaboración:",
//         error
//       );

//       alert("No se pudo eliminar la elaboración.");
//     }
//   };

//   // --------------------------------------------------
//   // LIMPIAR
//   // --------------------------------------------------

//   const limpiarFormulario = () => {

//     setForm({
//       fecha: "",
//       producto: "",
//       fruta: "",
//       cantidadFrutaTotal: "",
//       frutaDescartada: "",
//       cantidadAzucar: "",
//       tiempoElaboracion: "",
//       tiempoCoccion: "",
//       cantidadFrascos1kg: "",
//       cantidadFrascos420g: "",
//       comentario: "",
//     });

//     setEditando(null);
//   };

//   // --------------------------------------------------
//   // RENDER
//   // --------------------------------------------------

//   return (
//     <div className="page-container">

//       <h1>· MERMELADAS ·</h1>

//       {/* --------------------------------------------- */}
//       {/* FORMULARIO */}
//       {/* --------------------------------------------- */}

//       <Card>

//         <form onSubmit={guardar}>

//           <h2>
//             {editando
//               ? "Editar elaboración"
//               : "Nueva elaboración"}
//           </h2>

//           <div className="form-grid">

//             {/* FECHA */}

//             <FormField label="Fecha de elaboración" required>
//               <Input
//                 type="date"
//                 name="fecha"
//                 value={form.fecha}
//                 onChange={handleChange}
//                 required
//               />
//             </FormField>

//             {/* PRODUCTO */}

//             <FormField label="Producto elaborado" required>
//               <Select
//                 name="producto"
//                 value={form.producto}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">
//                   Seleccione una mermelada
//                 </option>

//                 {productosMermelada.map((producto) => (
//                   <option
//                     key={producto.idProducto}
//                     value={producto.idProducto}
//                   >
//                     {producto.nombreProducto}
//                   </option>
//                 ))}
//               </Select>
//             </FormField>

//             {/* FRUTA */}

//             <FormField label="Fruta utilizada" required>
//               <Select
//                 name="fruta"
//                 value={form.fruta}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">
//                   Seleccione una fruta
//                 </option>

//                 {frutas.map((producto) => (
//                   <option
//                     key={producto.idProducto}
//                     value={producto.idProducto}
//                   >
//                     {producto.nombreProducto}
//                   </option>
//                 ))}
//               </Select>
//             </FormField>

//             {/* FRUTA TOTAL */}

//             <FormField label="Fruta recibida (kg)">
//               <Input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 name="cantidadFrutaTotal"
//                 value={form.cantidadFrutaTotal}
//                 onChange={handleChange}
//               />
//             </FormField>

//             {/* DESCARTE */}

//             <FormField label="Fruta descartada (kg)">
//               <Input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 name="frutaDescartada"
//                 value={form.frutaDescartada}
//                 onChange={handleChange}
//               />
//             </FormField>

//             {/* UTILIZADA */}

//             <FormField label="Fruta utilizada (kg)">
//               <Input
//                 type="number"
//                 value={
//                   cantidadFrutaUtilizada >= 0
//                     ? cantidadFrutaUtilizada.toFixed(2)
//                     : ""
//                 }
//                 readOnly
//               />
//             </FormField>

//             {/* AZÚCAR */}

//             <FormField label="Azúcar utilizada (kg)">
//               <Input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 name="cantidadAzucar"
//                 value={form.cantidadAzucar}
//                 onChange={handleChange}
//               />
//             </FormField>

//             {/* TIEMPO ELABORACIÓN */}

//             <FormField label="Tiempo de elaboración (horas)">
//               <Input
//                 type="number"
//                 min="0"
//                 step="1"
//                 name="tiempoElaboracion"
//                 value={form.tiempoElaboracion}
//                 onChange={handleChange}
//               />
//             </FormField>

//             {/* COCCIÓN */}

//             <FormField label="Tiempo de cocción (minutos)">
//               <Input
//                 type="number"
//                 min="0"
//                 step="1"
//                 name="tiempoCoccion"
//                 value={form.tiempoCoccion}
//                 onChange={handleChange}
//               />
//             </FormField>

//             {/* FRASCOS 1 KG */}

//             <FormField label="Frascos de 1 kg">
//               <Input
//                 type="number"
//                 min="0"
//                 step="1"
//                 name="cantidadFrascos1kg"
//                 value={form.cantidadFrascos1kg}
//                 onChange={handleChange}
//               />
//             </FormField>

//             {/* FRASCOS 420 G */}

//             <FormField label="Frascos de 420 g">
//               <Input
//                 type="number"
//                 min="0"
//                 step="1"
//                 name="cantidadFrascos420g"
//                 value={form.cantidadFrascos420g}
//                 onChange={handleChange}
//               />
//             </FormField>

//             {/* TOTAL PRODUCIDO */}

//             <FormField label="Cantidad total producida (kg)">
//               <Input
//                 type="number"
//                 value={cantidadProducida.toFixed(2)}
//                 readOnly
//               />
//             </FormField>

//           </div>

//           {/* OBSERVACIONES */}

//           <FormField label="Observaciones">
//             <Textarea
//               name="comentario"
//               value={form.comentario}
//               onChange={handleChange}
//               rows={4}
//             />
//           </FormField>

//           {/* BOTONES */}

//           <div className="form-actions">

//             <Button type="submit">
//               {editando
//                 ? "Actualizar elaboración"
//                 : "Registrar elaboración"}
//             </Button>

//             {editando && (
//               <Button
//                 type="button"
//                 onClick={limpiarFormulario}
//               >
//                 Cancelar
//               </Button>
//             )}

//           </div>

//         </form>

//       </Card>

//       {/* --------------------------------------------- */}
//       {/* LISTADO */}
//       {/* --------------------------------------------- */}

//       <Card>

//         <h2>Elaboraciones registradas</h2>

//         <div className="table-container">

//           <table>

//             <thead>

//               <tr>
//                 <th>Fecha</th>
//                 <th>Producto</th>
//                 <th>Frascos 1 kg</th>
//                 <th>Frascos 420 g</th>
//                 <th>Total producido</th>
//                 <th>Acciones</th>
//               </tr>

//             </thead>

//             <tbody>

//               {registros.length === 0 ? (

//                 <tr>
//                   <td colSpan="6">
//                     No hay elaboraciones registradas.
//                   </td>
//                 </tr>

//               ) : (

//                 registros.map((registro) => (

//                   <tr key={registro.idElaboracion}>

//                     <td>
//                       {registro.fechaElaboracion}
//                     </td>

//                     <td>
//                       {
//                         registro.productoElaborado
//                           ?.nombreProducto
//                       }
//                     </td>

//                     <td>
//                       {registro.cantidadFrascos1kg || 0}
//                     </td>

//                     <td>
//                       {registro.cantidadFrascos420g || 0}
//                     </td>

//                     <td>
//                       {Number(
//                         registro.cantidadProducida || 0
//                       ).toFixed(2)}{" "}
//                       kg
//                     </td>

//                     <td>

//                       <Button
//                         type="button"
//                         onClick={() =>
//                           editar(registro)
//                         }
//                       >
//                         Editar
//                       </Button>

//                       <Button
//                         type="button"
//                         onClick={() =>
//                           eliminar(
//                             registro.idElaboracion
//                           )
//                         }
//                       >
//                         Eliminar
//                       </Button>

//                     </td>

//                   </tr>

//                 ))

//               )}

//             </tbody>

//           </table>

//         </div>

//       </Card>

//     </div>
//   );
// }


