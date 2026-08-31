import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Textarea from "../components/ui/Textarea";
import api from "../services/api";

export default function Huerta() {

  const [form, setForm] = useState({
    fecha: "",
    cultivo: "",
    cantidad: "",
    comentario: "",
  });

  const [productos, setProductos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);


  // ==========================================
  // OPCIONES PARA EL SELECT DE PRODUCTOS
  // ==========================================

  const opcionesProductos = productos
    .filter(producto => producto.activo)
    .map(producto => ({
      value: producto.idProducto,
      label: producto.nombreProducto,
    }));


  // ==========================================
  // CARGAR PRODUCTOS Y COSECHAS
  // ==========================================

  useEffect(() => {
    cargarProductos();
    cargarCosechas();
  }, []);


  async function cargarProductos() {

    try {

      const respuesta = await api.get("/productos");

      setProductos(respuesta.data);

    } catch (error) {

      console.error(
        "Error al cargar productos:",
        error
      );

    }
  }


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


  // ==========================================
  // CAMBIAR CAMPOS
  // ==========================================

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }


  // ==========================================
  // GUARDAR / ACTUALIZAR
  // ==========================================

  async function guardar(e) {

    e.preventDefault();

    try {

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

        cantidadCosecha: Number(
          form.cantidad
        ),

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


      console.log(
        "Datos enviados:",
        datos
      );


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

    }
  }


  // ==========================================
  // EDITAR
  // ==========================================

  function editarRegistro(registro) {

    setForm({

      fecha:
        registro.fechaCosecha || "",

      cultivo:
        registro.productoCosecha?.idProducto || "",

      cantidad:
        registro.cantidadCosecha || "",

      comentario:
        registro.observaciones || "",

    });

    setEditando(
      registro.idCosecha
    );

  }


  // ==========================================
  // ELIMINAR
  // ==========================================

  async function eliminarRegistro(id) {

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

    }

  }


  // ==========================================
  // LIMPIAR FORMULARIO
  // ==========================================

  function limpiarFormulario() {

    setForm({

      fecha: "",
      cultivo: "",
      cantidad: "",
      comentario: "",

    });

    setEditando(null);

  }


  // ==========================================
  // HTML
  // ==========================================

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
              Producto
            </label>

            <Select
              name="cultivo"
              value={form.cultivo}
              onChange={handleChange}
              options={opcionesProductos}
              placeholder="Seleccione un producto"
              required
            />
          </div>

          <div className="input-group">
            <label>
              Cantidad
            </label>

            <Input
              type="number"
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
            >
              {editando !== null
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

                <th>
                  Producto
                </th>

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

                    {
                      opcionesProductos.find(
                        o =>
                          String(o.value) ===
                          String(
                            r.productoCosecha
                              ?.idProducto
                          )
                      )?.label
                    }

                  </td>


                  <td>{r.cantidadCosecha}</td>


                  <td>
                    {r.observaciones}
                  </td>


                  <td>

                    <div className="table-actions">

                      <Button
                        variant="secondary"
                        onClick={() =>
                          editarRegistro(r)
                        }
                      >
                        Editar
                      </Button>


                      <Button
                        variant="danger"
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