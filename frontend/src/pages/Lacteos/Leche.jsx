import { useEffect, useState } from "react";
import api from "../../services/api";
import { mensajeError, puedeModificarRegistro } from "../../utils/errores";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";

const formularioInicial = {
  fecha: "",
  litrosTotales: "",
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
  const [inventario, setInventario] = useState(null);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");

  useEffect(() => {
    cargarRegistros();
  }, []);

  async function cargarRegistros() {
    setCargando(true);
    let huboError = false;
    try {
      const response = await api.get("/produccion-leche");
      setRegistros(response.data);
    } catch (error) {
      console.error("Error al cargar registros de producción de leche:", error);
      huboError = true;
    }
    try {
      const respuestaInventario = await api.get("/produccion-leche/inventario");
      setInventario(respuestaInventario.data);
    } catch (error) {
      console.error("Error al cargar el inventario de leche:", error);
      huboError = true;
    } finally {
      setErrorCarga(huboError ? "No se pudieron cargar todos los datos de leche." : "");
      setCargando(false);
    }
  }

  const camposDestino = [
    "litrosTerneros",
    "ventaDirecta",
    "consumoCocina",
    "elaboracionQuesos",
    "elaboracionDulceDeLeche",
    "elaboracionQuark",
  ];
  const sumaAsignada = camposDestino.reduce(
    (total, campo) => total + (Number(form[campo]) || 0), 0);
  const litrosRestantes = Math.max(
    (Number(form.litrosTotales) || 0) - sumaAsignada, 0);

  function maximoPara(campo) {
    return Math.max(litrosRestantes + (Number(form[campo]) || 0), 0);
  }

  function formatearLitros(valor) {
    return Number(valor.toFixed(2));
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }


  async function guardar(e) {
  e.preventDefault();

  try {
    setGuardando(true);

    const cantidades = [
      form.litrosTerneros,
      form.ventaDirecta,
      form.consumoCocina,
      form.elaboracionQuesos,
      form.elaboracionDulceDeLeche,
      form.elaboracionQuark,
    ].map(Number);
    const litrosTotales = Number(form.litrosTotales);
    const litrosAsignados = cantidades.reduce((total, cantidad) => total + cantidad, 0);

    if (!Number.isFinite(litrosTotales) || litrosTotales <= 0) {
      alert("Los litros totales producidos deben ser mayores que cero.");
      return;
    }

    if (!cantidades.every((cantidad) => Number.isFinite(cantidad) && cantidad >= 0)) {
      alert("Los litros destinados deben ser números válidos y no pueden ser negativos.");
      return;
    }

    if (litrosAsignados > litrosTotales) {
      alert("Los litros asignados no pueden superar el total producido.");
      return;
    }

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
      litrosTotales,
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

    alert(mensajeError(error, "No se pudo guardar el registro."));
  } finally {
    setGuardando(false);
  }
}


  function editarRegistro(registro) {

    setForm({
      fecha: registro.fecha ?? "",
      litrosTotales: registro.litrosTotales
        ?? [
          registro.litrosTerneros,
          registro.ventaDirecta,
          registro.consumoCocina,
          registro.elaboracionQuesos,
          registro.elaboracionDulceDeLeche,
          registro.elaboracionQuark,
        ].reduce((total, litros) => total + (Number(litros) || 0), 0),
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

      alert(mensajeError(error, "No se pudo eliminar el registro."));
    }
  }

  function cancelarEdicion() {
    setForm(formularioInicial);
    setEditando(null);
  }

  return (
    <div className="pagina">

      <Card title="· DISTRIBUCION DE LECHE ·">
        {errorCarga && <p className="mensaje-error" role="alert">{errorCarga}</p>}

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
            <label>Litros totales producidos</label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              name="litrosTotales"
 value={form.litrosTotales}
 onChange={handleChange}
 required
 />
 <small>Litros restantes para asignar: {formatearLitros(litrosRestantes)} L</small>
          </div>

          <div className="input-group">

            <h3>Destino (Lts)</h3>

            <hr />

            <br />

            <label>Terneros</label>

            <Input
              type="number"
              step="0.01"
              min="0"
              name="litrosTerneros"
 value={form.litrosTerneros}
 onChange={handleChange}
 max={maximoPara("litrosTerneros")}
 required
 />
 <small>Máximo disponible: {formatearLitros(maximoPara("litrosTerneros"))} L</small>

          </div>

          {/* VENTA DIRECTA */}

          <div className="input-group">

            <label>Venta directa</label>

            <Input
              type="number"
              step="0.01"
              min="0"
              name="ventaDirecta"
 value={form.ventaDirecta}
 onChange={handleChange}
 max={maximoPara("ventaDirecta")}
 required
 />
 <small>Máximo disponible: {formatearLitros(maximoPara("ventaDirecta"))} L</small>

          </div>

          {/* CONSUMO COCINA */}

          <div className="input-group">

            <label>Consumo cocina</label>

            <Input
              type="number"
              step="0.01"
              min="0"
              name="consumoCocina"
 value={form.consumoCocina}
 onChange={handleChange}
 max={maximoPara("consumoCocina")}
 required
 />
 <small>Máximo disponible: {formatearLitros(maximoPara("consumoCocina"))} L</small>

          </div>

          {/* QUESO */}

          <div className="input-group">

            <label>Queso</label>

            <Input
              type="number"
              step="0.01"
              min="0"
              name="elaboracionQuesos"
 value={form.elaboracionQuesos}
 onChange={handleChange}
 max={maximoPara("elaboracionQuesos")}
 required
 />
 <small>Máximo disponible: {formatearLitros(maximoPara("elaboracionQuesos"))} L</small>

          </div>

          {/* DULCE DE LECHE */}

          <div className="input-group">

            <label>Dulce de leche</label>

            <Input
              type="number"
              step="0.01"
              min="0"
              name="elaboracionDulceDeLeche"
 value={form.elaboracionDulceDeLeche}
 onChange={handleChange}
 max={maximoPara("elaboracionDulceDeLeche")}
 required
 />
 <small>Máximo disponible: {formatearLitros(maximoPara("elaboracionDulceDeLeche"))} L</small>

          </div>

          {/* QUARK */}

          <div className="input-group">

            <label>Quark</label>

            <Input
              type="number"
              step="0.01"
              min="0"
              name="elaboracionQuark"
 value={form.elaboracionQuark}
 onChange={handleChange}
 max={maximoPara("elaboracionQuark")}
 required
 />
 <small>Máximo disponible: {formatearLitros(maximoPara("elaboracionQuark"))} L</small>

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
                : editando !== null
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

        <h3>Inventario de leche por destino</h3>
        {inventario && (
          <>
            <p>
              Producidos: {inventario.litrosTotales} L · Asignados: {inventario.litrosAsignados} L ·
              Utilizados: {inventario.litrosUtilizados} L
            </p>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr><th>Destino</th><th>Asignados (L)</th><th>Utilizados (L)</th><th>Disponibles (L)</th></tr>
                </thead>
                <tbody>
                  {inventario.areas.map((area) => (
                    <tr key={area.destino}>
                      <td>{area.etiqueta}</td>
                      <td>{area.asignado}</td>
                      <td>{area.utilizado}</td>
                      <td>{area.disponible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

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
                  <th>Total producido</th>
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
                    <td colSpan="10">
                      No hay registros de producción de leche.
                    </td>
                  </tr>

                ) : (

                  registros.map((r) => (

                    <tr key={r.idProduccionLeche}>

                      <td>{r.fecha}</td>
                      <td>
                        {r.litrosTotales ?? [
                          r.litrosTerneros,
                          r.ventaDirecta,
                          r.consumoCocina,
                          r.elaboracionQuesos,
                          r.elaboracionDulceDeLeche,
                          r.elaboracionQuark,
                        ].reduce((total, litros) => total + (Number(litros) || 0), 0)} L
                      </td>

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
