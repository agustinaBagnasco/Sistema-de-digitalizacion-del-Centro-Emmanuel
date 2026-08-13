import { useState, useEffect } from "react";
import cultivos from "../data/cultivos.json";
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

  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);

  const opcionesCultivos = cultivos.map(cultivo => ({
    value: cultivo.id,
    label: cultivo.nombre,
  }));


  // ==============================
  // CARGAR COSECHAS
  // ==============================

  useEffect(() => {
    cargarCosechas();
  }, []);


  async function cargarCosechas() {

    try {

      const respuesta = await api.get("/cosechas");

      setRegistros(respuesta.data);

    } catch (error) {

      console.error("Error al cargar las cosechas:", error);

    }

  }


  // ==============================
  // CAMBIAR CAMPOS
  // ==============================

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }


  // ==============================
  // GUARDAR / ACTUALIZAR
  // ==============================

  async function guardar(e) {

    e.preventDefault();

    try {

      const datos = {
        fechaCosecha: form.fecha,
        cantidadCosecha: Number(form.cantidad),
        observaciones: form.comentario,

        productoCosecha: {
          idProducto: Number(form.cultivo)
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


      await cargarCosechas();

      limpiarFormulario();

    } catch (error) {

      console.error("Error al guardar la cosecha:", error);

    }

  }


  // ==============================
  // EDITAR
  // ==============================

  function editarRegistro(registro) {

    setForm({
      fecha: registro.fechaCosecha || "",
      cultivo: registro.productoCosecha?.idProducto || "",
      cantidad: registro.cantidadCosecha || "",
      comentario: registro.observaciones || "",
    });

    setEditando(registro.idCosecha);

  }


  // ==============================
  // ELIMINAR
  // ==============================

  async function eliminarRegistro(id) {

    try {

      await api.delete(`/cosechas/${id}`);

      await cargarCosechas();

    } catch (error) {

      console.error("Error al eliminar la cosecha:", error);

    }

  }


  // ==============================
  // LIMPIAR FORMULARIO
  // ==============================

  function limpiarFormulario() {

    setForm({
      fecha: "",
      cultivo: "",
      cantidad: "",
      comentario: "",
    });

    setEditando(null);

  }


  return (

    <div className="pagina">

      <Card title="Registro de Cultivos">

        <form
          onSubmit={guardar}
          className="formulario"
        >

          <label>Fecha</label>

          <Input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />

          <br />


          <label>Cultivo</label>

          <Select
            name="cultivo"
            value={form.cultivo}
            onChange={handleChange}
            options={opcionesCultivos}
            placeholder="Seleccione un cultivo"
            required
          />

          <br />


          <label>Cantidad</label>

          <Input
            type="number"
            name="cantidad"
            value={form.cantidad}
            onChange={handleChange}
            required
          />

          <br />


          <label>Observacion</label>

          <Textarea
            name="comentario"
            value={form.comentario}
            onChange={handleChange}
            placeholder=" observaciones..."
          />

          <br />


          <Button
            type="submit"
            className="btn btn-primary"
          >
            {editando !== null ? "Actualizar" : "Guardar"}
          </Button>

        </form>


        <br />

        <hr />

        <div className="table-container">

          <table className="table">

            <thead>

              <tr>
                <th>Fecha</th>
                <th>Cultivo</th>
                <th>Cantidad</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>

            </thead>


            <tbody>

              {registros.map((r) => (

                <tr key={r.idCosecha}>

                  <td>
                    {r.fechaCosecha}
                  </td>


                  <td>

                    {
                      opcionesCultivos.find(
                        o =>
                          String(o.value) ===
                          String(r.productoCosecha?.idProducto)
                      )?.label
                    }

                  </td>


                  <td>
                    {r.cantidadCosecha}
                  </td>


                  <td>
                    {r.observaciones}
                  </td>


                  <td>

                    <div className="table-actions">

                      <Button
                        variant="secondary"
                        onClick={() => editarRegistro(r)}
                      >
                        Editar
                      </Button>


                      <Button
                        variant="danger"
                        onClick={() =>
                          eliminarRegistro(r.idCosecha)
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


