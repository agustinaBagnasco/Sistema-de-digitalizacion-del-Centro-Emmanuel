import { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import api from "../../services/api";
import { mensajeError, puedeModificarRegistro } from "../../utils/errores";
import { etiquetaInsumo } from "../../utils/formatNumber";

export default function Molienda() {
  const [form, setForm] = useState({
    fecha: "",
    grano: "",
    tiempoElaboracion: "",
    kgsEnvasados: "",
    comentario: "",
  });

  const [granos, setGranos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarGranos();
    cargarElaboraciones();
  }, []);

  // CARGAR GRANOS
  async function cargarGranos() {
    try {
      const response = await api.get("/productos");

      const productosGranos = response.data.filter(
        (producto) =>
          producto.tipo === "INSUMO" &&
          producto.categoria === "GRANOS" &&
          producto.activo === true
      );

      setGranos(productosGranos);
    } catch (error) {
      console.error("Error al cargar granos:", error);
    }
  }

  // CARGAR ELABORACIONES
  async function cargarElaboraciones() {
    try {
      const response = await api.get("/elaboraciones");

      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      console.log("ELABORACIONES:", data);

      const elaboracionesMolienda = data.filter(
        (elaboracion) =>
          elaboracion.detalles &&
          elaboracion.detalles.length > 0 &&
          elaboracion.detalles.some(
            (detalle) =>
              detalle.insumoUtilizado?.categoria === "GRANOS"
          )
      );

      setRegistros(elaboracionesMolienda);

    } catch (error) {
      console.error(
        "Error al cargar elaboraciones:",
        error
      );
    }
  }




  // OPCIONES DEL SELECT
  const opcionesGranos = granos.map((grano) => ({
    value: grano.idProducto,
    label: etiquetaInsumo(grano),
  }));
  const granoSeleccionado = granos.find(
    (grano) => Number(grano.idProducto) === Number(form.grano)
  );
  const stockGranoDisponible = Math.max(
    Number(granoSeleccionado?.stockActual) || 0,
    0
  );

  // CAMBIAR CAMPOS
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // GUARDAR
  async function guardar(e) {
    e.preventDefault();

    const cantidadEnvasada = Number(form.kgsEnvasados);
    if (!Number.isFinite(cantidadEnvasada) || cantidadEnvasada <= 0) {
      alert("Ingrese una cantidad de grano envasado mayor que cero.");
      return;
    }

    const granoDelFormulario = granos.find(
      (grano) => Number(grano.idProducto) === Number(form.grano)
    );
    const stockDisponible = Number(granoDelFormulario?.stockActual) || 0;
    if (cantidadEnvasada > stockDisponible) {
      alert(`Solo hay ${stockDisponible} kg disponibles del grano seleccionado.`);
      return;
    }

    try {
      setGuardando(true);
      const granoSeleccionado = granos.find(
        (grano) =>
          Number(grano.idProducto) === Number(form.grano)
      );

      if (!granoSeleccionado) {
        alert("Debe seleccionar un grano.");
        return;
      }

      // El grano debe tener configurado
      // su producto resultado.
      if (!granoSeleccionado.productoResultado) {
        alert(
          "El grano seleccionado no tiene configurado su producto resultado."
        );
        return;
      }

      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        alert("No se encontró el usuario logueado.");
        return;
      }

      const usuario = JSON.parse(usuarioGuardado);

      if (!usuario.idUsuario) {
        alert("El usuario logueado no tiene un ID.");
        return;
      }


      const elaboracion = {
        productoElaborado: {
          idProducto:
            granoSeleccionado.productoResultado.idProducto,
        },

        fechaElaboracion: form.fecha,

        tiempoElaboracion: Number(
          form.tiempoElaboracion
        ),

        // Los kg envasados son la cantidad producida
        cantidadProducida: cantidadEnvasada,

        usuario: {
          idUsuario: Number(usuario.idUsuario),
        },

        observaciones: form.comentario,

        detalles: [
          {
            // El grano utilizado
            insumoUtilizado: {
              idProducto:
                granoSeleccionado.idProducto,
            },

            // Se utiliza la misma cantidad
            // que se registra como producida
            cantidadUtilizada: cantidadEnvasada,
          },
        ],
      };

      if (editando !== null) {
        await api.put(
          `/elaboraciones/${editando}`,
          elaboracion
        );

        alert("Molienda actualizada correctamente.");
      } else {
        await api.post(
          "/elaboraciones",
          elaboracion
        );

        alert("Molienda registrada correctamente.");
      }

      limpiarFormulario();
      await cargarElaboraciones();

    } catch (error) {
      console.error(
        "Error al guardar la molienda:",
        error
      );

      console.error(
        "Respuesta del backend:",
        error.response?.data
      );

      alert(mensajeError(error, "No se pudo guardar la molienda."));
    } finally {
      setGuardando(false);
    }
  }

  // LIMPIAR FORMULARIO
  function limpiarFormulario() {
    setForm({
      fecha: "",
      grano: "",
      tiempoElaboracion: "",
      kgsEnvasados: "",
      comentario: "",
    });

    setEditando(null);
  }

  // EDITAR
  function editarRegistro(registro) {
    const detalleGrano =
      registro.detalles?.find(
        (detalle) =>
          detalle.insumoUtilizado?.categoria ===
          "GRANOS"
      );

    setForm({
      fecha: registro.fechaElaboracion || "",

      grano:
        detalleGrano?.insumoUtilizado?.idProducto || "",

      tiempoElaboracion:
        registro.tiempoElaboracion || "",

      kgsEnvasados:
        registro.cantidadProducida || "",

      comentario:
        registro.observaciones || "",
    });

    setEditando(registro.idElaboracion);
  }

  // ELIMINAR
  async function eliminarRegistro(id) {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar esta molienda?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(
        `/elaboraciones/${id}`
      );

      alert("Molienda eliminada correctamente.");

      await cargarElaboraciones();

    } catch (error) {
      console.error(
        "Error al eliminar molienda:",
        error
      );

      alert(mensajeError(error, "No se pudo eliminar la molienda."));
    }
  }

  return (
    <div className="pagina">
      <Card title="· REGISTRO DE MOLIENDA ·">

        <form
          onSubmit={guardar}
          className="form-field columns-2"
        >

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

          <div className="input-group">
            <label>Grano</label>

            <Select
              name="grano"
              value={form.grano}
              onChange={handleChange}
              options={opcionesGranos}
              placeholder="Seleccione tipo de grano"
              required
            />
          </div>

          <div className="input-group">
            <label>Tiempo de elaboracion</label>

            <Input
              type="number"
              name="tiempoElaboracion"
              value={form.tiempoElaboracion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Kgs envasados</label>

            <Input
              type="number"
              step="0.01"
              min="0.01"
              max={stockGranoDisponible}
              name="kgsEnvasados"
              value={form.kgsEnvasados}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Comentario</label>

            <Textarea
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              placeholder="Ingrese observaciones..."
            />
          </div>

          <div className="form-button-container">

            <Button
              type="submit"
              className="btn btn-primary"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : editando !== null
                ? "Actualizar"
                : "Guardar"}
            </Button>

            {editando !== null && (
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

        <div className="table-container">

          <table className="table">

            <thead>
              <tr>
                <th>Fecha</th>
                <th>Grano</th>
                <th>Harina obtenida</th>
                <th>Tiempo de elaboracion</th>
                <th>Kgs envasados</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {registros.map((r) => {

                const detalleGrano =
                  r.detalles?.find(
                    (detalle) =>
                      detalle.insumoUtilizado
                        ?.categoria === "GRANOS"
                  );

                return (
                  <tr key={r.idElaboracion}>

                    <td>
                      {r.fechaElaboracion}
                    </td>

                    <td>
                      {
                        detalleGrano
                          ?.insumoUtilizado
                          ?.nombreProducto
                      }
                    </td>

                    <td>
                      {
                        r.productoElaborado
                          ?.nombreProducto
                      }
                    </td>

                    <td>
                      {r.tiempoElaboracion}
                    </td>

                    <td>
                      {r.cantidadProducida}
                    </td>

                    <td>
                      {r.observaciones}
                    </td>

                    <td>
                      <div className="table-actions">

                        <Button
                          variant="secondary"
                          disabled={!puedeModificarRegistro(r)}
                          onClick={() =>
                            editarRegistro(r)
                          }
                        >
                          Editar
                        </Button>

                        <Button
                          variant="danger"
                          disabled={!puedeModificarRegistro(r)}
                          onClick={() =>
                            eliminarRegistro(
                              r.idElaboracion
                            )
                          }
                        >
                          Eliminar
                        </Button>

                      </div>
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </Card>
    </div>
  );
}
