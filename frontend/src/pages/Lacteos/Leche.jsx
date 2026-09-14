import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";

const formularioInicial = {
  fecha: "",
  litrosTerneros: "",
  ventaDirecta: "",
  consumoCocina: "",
  elaboracionQuesos: "",
  elaboracionDulceDeLeche: "",
  elaboracionQuark: "",
  comentario: "",
};

export default function Leche() {

  const [form, setForm] = useState(formularioInicial);
  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(false);

  // ============ CARGAR REGISTROS DESDE LA BASE DE DATOS ================

  useEffect(() => {
    cargarRegistros();
  }, []);

  async function cargarRegistros() {
    try {
      setCargando(true);

      const response = await api.get("/produccion-leche");

      setRegistros(response.data);

    } catch (error) {
      console.error("Error al cargar producción de leche:", error);
      alert("No se pudieron cargar los registros de producción de leche.");
    } finally {
      setCargando(false);
    }
  }

  // ============== MANEJAR CAMBIOS DEL FORMULARIO ====================

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // ============== GUARDAR / ACTUALIZAR ====================

  const usuarioGuardado = localStorage.getItem("usuario");
const usuario = usuarioGuardado
  ? JSON.parse(usuarioGuardado)
  : null;


  async function guardar(e) {
  e.preventDefault();

  try {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      alert("No hay un usuario conectado.");
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    if (!usuario.idUsuario) {
      alert("No se pudo identificar al usuario conectado.");
      return;
    }

    const datos = {
      fecha: form.fecha,
      litrosTerneros: Number(form.litrosTerneros),
      ventaDirecta: Number(form.ventaDirecta),
      consumoCocina: Number(form.consumoCocina),
      elaboracionQuesos: Number(form.elaboracionQuesos),
      elaboracionDulceDeLeche: Number(form.elaboracionDulceDeLeche),
      elaboracionQuark: Number(form.elaboracionQuark),
      comentario: form.comentario,

      usuario: {
        idUsuario: usuario.idUsuario
      }
    };

    if (editando !== null) {

      await api.put(
        `/produccion-leche/${editando}`,
        datos
      );

      alert("Registro actualizado correctamente.");

    } else {

      await api.post(
        "/produccion-leche",
        datos
      );

      alert("Registro guardado correctamente.");
    }

    await cargarRegistros();

    setForm(formularioInicial);
    setEditando(null);

  } catch (error) {

    console.error(
      "Error al guardar producción de leche:",
      error
    );

    console.error(
      "Respuesta del servidor:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "No se pudo guardar el registro."
    );
  }
}

  // ============= EDITAR ====================

  function editarRegistro(registro) {

    setForm({
      fecha: registro.fecha ?? "",
      litrosTerneros: registro.litrosTerneros ?? "",
      ventaDirecta: registro.ventaDirecta ?? "",
      consumoCocina: registro.consumoCocina ?? "",
      elaboracionQuesos: registro.elaboracionQuesos ?? "",
      elaboracionDulceDeLeche:
        registro.elaboracionDulceDeLeche ?? "",
      elaboracionQuark:
        registro.elaboracionQuark ?? "",
      comentario: registro.comentario ?? "",
    });

    setEditando(registro.idProduccionLeche);
  }

  // ================== ELIMINAR ==================

  async function eliminarRegistro(id) {

    if (!window.confirm(
      "¿Está seguro de eliminar este registro?"
    )) {
      return;
    }

    try {

      await api.delete(
        `/produccion-leche/${id}`
      );

      await cargarRegistros();

      alert("Registro eliminado correctamente.");

    } catch (error) {

      console.error(
        "Error al eliminar producción de leche:",
        error
      );

      alert("No se pudo eliminar el registro.");
    }
  }

  // ================= CANCELAR EDICIÓN ===================

  function cancelarEdicion() {
    setForm(formularioInicial);
    setEditando(null);
  }

  return (
    <div className="pagina">

      <Card title="· REGISTRO DE PRODUCCION DE LECHE ·">

        <div className="form-button-container">

          <Button
            onClick={() => {
              alert(
                "Funcionalidad de carga de control lechero no implementada aún."
              );
            }}
            className="btn btn-danger"
          >
            Cargar Control Lechero
          </Button>

        </div>

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

          {/* TERNEROS */}

          <div className="input-group">

            <h3>Destino (Lts)</h3>

            <hr />

            <br />

            <label>Terneros</label>

            <Input
              type="number"
              step="0.01"
              name="litrosTerneros"
              value={form.litrosTerneros}
              onChange={handleChange}
              required
            />

          </div>

          {/* VENTA DIRECTA */}

          <div className="input-group">

            <label>Venta directa</label>

            <Input
              type="number"
              step="0.01"
              name="ventaDirecta"
              value={form.ventaDirecta}
              onChange={handleChange}
              required
            />

          </div>

          {/* CONSUMO COCINA */}

          <div className="input-group">

            <label>Consumo cocina</label>

            <Input
              type="number"
              step="0.01"
              name="consumoCocina"
              value={form.consumoCocina}
              onChange={handleChange}
              required
            />

          </div>

          {/* QUESO */}

          <div className="input-group">

            <label>Queso</label>

            <Input
              type="number"
              step="0.01"
              name="elaboracionQuesos"
              value={form.elaboracionQuesos}
              onChange={handleChange}
              required
            />

          </div>

          {/* DULCE DE LECHE */}

          <div className="input-group">

            <label>Dulce de leche</label>

            <Input
              type="number"
              step="0.01"
              name="elaboracionDulceDeLeche"
              value={form.elaboracionDulceDeLeche}
              onChange={handleChange}
              required
            />

          </div>

          {/* QUARK */}

          <div className="input-group">

            <label>Quark</label>

            <Input
              type="number"
              step="0.01"
              name="elaboracionQuark"
              value={form.elaboracionQuark}
              onChange={handleChange}
              required
            />

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
            >
              {editando !== null
                ? "Actualizar"
                : "Guardar"}
            </Button>

            {editando !== null && (

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

        <br />

        <hr />

        {/* TABLA */}

        <div className="table-container">

          {cargando ? (

            <p>Cargando registros...</p>

          ) : (

            <table className="table">

              <thead>

                <tr>
                  <th>Fecha</th>
                  <th>Terneros</th>
                  <th>Venta directa</th>
                  <th>Consumo cocina</th>
                  <th>Queso</th>
                  <th>Dulce de leche</th>
                  <th>Quark</th>
                  <th>Comentario</th>
                  <th>Acciones</th>
                </tr>

              </thead>

              <tbody>

                {registros.length === 0 ? (

                  <tr>
                    <td colSpan="9">
                      No hay registros de producción de leche.
                    </td>
                  </tr>

                ) : (

                  registros.map((r) => (

                    <tr key={r.idProduccionLeche}>

                      <td>{r.fecha}</td>

                      <td>{r.litrosTerneros}</td>

                      <td>{r.ventaDirecta}</td>

                      <td>{r.consumoCocina}</td>

                      <td>{r.elaboracionQuesos}</td>

                      <td>{r.elaboracionDulceDeLeche}</td>

                      <td>{r.elaboracionQuark}</td>

                      <td>{r.comentario}</td>

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
                                r.idProduccionLeche
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

          )}

        </div>

      </Card>

    </div>
  );
}


