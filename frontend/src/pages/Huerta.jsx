import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Textarea from "../components/ui/Textarea";
import api from "../services/api";
import { mensajeError, puedeModificarRegistro } from "../utils/errores";
import { etiquetaInsumo } from "../utils/formatNumber";
import { categorias } from "../services/producto";

const categoriasCosecha = categorias.filter(({ value }) => (
  ["FRUTA", "FRUTASYHORTALIZAS", "GRANOS"].includes(value)
)).map((categoria) => (
  categoria.value === "FRUTA" ? { ...categoria, label: "Frutas" } : categoria
));

export default function Huerta() {

  const [form, setForm] = useState({
    fecha: "",
    categoria: "",
    cultivo: "",
    cantidad: "",
    comentario: "",
  });

  const [productos, setProductos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

     useEffect(() => {
    cargarProductos();
    cargarCosechas();
  }, []);

    
  async function cargarCosechas() {
  try {
    const respuesta = await api.get("/cosechas");

    setRegistros(respuesta.data);

  } catch (error) {
    console.error(
      "Error al cargar las cosechas:",
      error
    );
  }
}
 
const opcionesProductos = productos
  .filter(producto => (
    producto.activo
    && producto.tipo === "INSUMO"
    && categoriasCosecha.some(({ value }) => value === producto.categoria)
    && (!form.categoria || producto.categoria === form.categoria)
  ))
  .map(producto => ({
    value: producto.idProducto,
    label: etiquetaInsumo(producto),
  }));


async function cargarProductos() {
  try {
    const respuesta = await api.get("/productos");
    setProductos(respuesta.data);

  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function guardar(e) {

    e.preventDefault();

    const cantidad = Number(form.cantidad);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      alert("La cantidad cosechada debe ser mayor que cero.");
      return;
    }

    const insumoSeleccionado = productos.find((producto) => (
      String(producto.idProducto) === String(form.cultivo)
      && producto.activo
      && producto.tipo === "INSUMO"
      && categoriasCosecha.some(({ value }) => value === producto.categoria)
      && producto.categoria === form.categoria
    ));
    if (!insumoSeleccionado) {
      alert("Seleccione un insumo activo de la categoría elegida.");
      return;
    }

    try {
      setGuardando(true);

      // Usuario que inició sesión
      const usuario = JSON.parse(
        localStorage.getItem("usuario")
      );


      if (!usuario || !usuario.idUsuario) {

        alert(
          "No se pudo identificar al usuario."
        );

        return;
      }


      const datos = {

        fechaCosecha: form.fecha,

        cantidadCosecha: cantidad,

        observaciones: form.comentario,

        productoCosecha: {
          idProducto: Number(
            form.cultivo
          )
        },

        usuario: {
          idUsuario: Number(
            usuario.idUsuario
          )
        }
      };



      if (editando !== null) {

        await api.put(
          `/cosechas/${editando}`,
          datos
        );

      } else {

        await api.post(
          "/cosechas",
          datos
        );

      }


      // Volvemos a cargar las cosechas
      await cargarCosechas();

      limpiarFormulario();

    } catch (error) {

      console.error(
        "Error al guardar la cosecha:",
        error
      );

      alert(mensajeError(error, "No se pudo guardar la cosecha."));

    } finally {
      setGuardando(false);
    }
  }

  function editarRegistro(registro) {
    const categoriaProducto = registro.productoCosecha?.categoria || "";
    const categoriaPermitida = categoriasCosecha.some(
      ({ value }) => value === categoriaProducto
    );

    setForm({

      fecha:
        registro.fechaCosecha || "",

      categoria:
        categoriaPermitida ? categoriaProducto : "",

      cultivo:
        categoriaPermitida
          && registro.productoCosecha?.tipo === "INSUMO"
          ? registro.productoCosecha.idProducto
          : "",

      cantidad:
        registro.cantidadCosecha || "",

      comentario:
        registro.observaciones || "",

    });

    setEditando(
      registro.idCosecha
    );

  }

  async function eliminarRegistro(id) {

    if (!window.confirm("¿Está seguro de eliminar esta cosecha? Se descontará del stock del insumo.")) {
      return;
    }

    try {

      await api.delete(
        `/cosechas/${id}`
      );

      await cargarCosechas();

    } catch (error) {

      console.error(
        "Error al eliminar la cosecha:",
        error
      );

      alert(mensajeError(error, "No se pudo eliminar la cosecha."));

    }

  }

  function limpiarFormulario() {

    setForm({

      fecha: "",
      categoria: "",
      cultivo: "",
      cantidad: "",
      comentario: "",

    });

    setEditando(null);

  }

  return (

    <div className="pagina">

      <Card title=" · REGISTRO DE CULTIVOS ·">

        <form
          onSubmit={guardar}
          className="form-field columns-2"
        >
          <div className="input-group">
            <label>
              Fecha
            </label>

            <Input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>
              Categoría
            </label>
            <Select
              name="categoria"
              value={form.categoria}
              onChange={(evento) => {
                setForm((formulario) => ({
                  ...formulario,
                  categoria: evento.target.value,
                  cultivo: "",
                }));
              }}
              options={categoriasCosecha}
              placeholder="Seleccione una categoría"
              required
            />
          </div>

          <div className="input-group">
            <label>
              Insumo cosechado
            </label>

            <Select
              name="cultivo"
              value={form.cultivo}
              onChange={handleChange}
              options={opcionesProductos}
              placeholder={form.categoria
                ? "Seleccione un insumo"
                : "Primero seleccione una categoría"}
              disabled={!form.categoria}
              required
            />
          </div>

          <div className="input-group">
            <label>
              Cantidad
            </label>

            <Input
              type="number"
              min="0.01"
              step="0.01"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>
              Observación
            </label>

            <Textarea
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              placeholder="Observaciones..."
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
          </div>
        </form>

        <br />
        <hr />

        <div className="table-container">

          <table className="table">

            <thead>
              <tr>
                <th>
                  Fecha
                </th>

                <th>Insumo</th>

                <th>
                  Cantidad
                </th>

                <th>
                  Comentario
                </th>

                <th>
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>

              {registros.map((r) => (

                <tr
                  key={r.idCosecha}
                >

                  <td>
                    {r.fechaCosecha}
                  </td>


                  <td>

                    {r.productoCosecha?.nombreProducto
                      || opcionesProductos.find(
                        opcion => String(opcion.value) === String(r.productoCosecha?.idProducto)
                      )?.label
                      || "Insumo no disponible"}

                  </td>


                  <td>{r.cantidadCosecha}</td>


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
                            r.idCosecha
                          )
                        }
                      >
                        Eliminar
                      </Button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </Card>

    </div>

  );
}