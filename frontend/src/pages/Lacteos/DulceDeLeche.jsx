import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import api from "../../services/api";

export default function DulceDeLeche() {

  const formularioInicial = {
    fecha: "",
    litrosLeche: "",
    cantidadAzucar: "",
    cantidadBicarbonato: "",
    tiempoElaboracion: "",
    cantFrascos1kg: "",
    cantFrascos420g: "",
    comentario: "",
  };

  const [form, setForm] = useState(formularioInicial);

  const [registros, setRegistros] = useState([]);

  const [productos, setProductos] = useState([]);

  const [productoDulce, setProductoDulce] = useState(null);
  const [productoLeche, setProductoLeche] = useState(null);
  const [productoAzucar, setProductoAzucar] = useState(null);
  const [productoBicarbonato, setProductoBicarbonato] = useState(null);

  const [editando, setEditando] = useState(null);

  const [cargando, setCargando] = useState(true);


  // =====================================================
  // CARGAR DATOS INICIALES
  // =====================================================

  useEffect(() => {
    cargarDatos();
  }, []);


  async function cargarDatos() {

    try {

      setCargando(true);

      const [respuestaProductos, respuestaElaboraciones] =
        await Promise.all([
          api.get("/productos"),
          api.get("/elaboraciones")
        ]);


      const listaProductos = Array.isArray(respuestaProductos.data)
        ? respuestaProductos.data
        : [];


      const listaElaboraciones =
        Array.isArray(respuestaElaboraciones.data)
          ? respuestaElaboraciones.data
          : [];


      setProductos(listaProductos);


      // =================================================
      // BUSCAR PRODUCTOS
      // =================================================

      const dulce = listaProductos.find(
        p =>
          p.categoria === "DULCEDELECHE" &&
          p.activo === true
      );

      const leche = listaProductos.find(
        p =>
          p.categoria === "LECHE" &&
          p.activo === true
      );

      const azucar = listaProductos.find(
        p =>
          p.nombreProducto?.toLowerCase().includes("azucar") ||
          p.nombreProducto?.toLowerCase().includes("azúcar")
      );

      const bicarbonato = listaProductos.find(
        p =>
          p.nombreProducto?.toLowerCase().includes("bicarbonato")
      );


      setProductoDulce(dulce || null);
      setProductoLeche(leche || null);
      setProductoAzucar(azucar || null);
      setProductoBicarbonato(bicarbonato || null);


      // =================================================
      // MOSTRAR SOLAMENTE ELABORACIONES DE DULCE DE LECHE
      // =================================================

      const elaboracionesDulce = listaElaboraciones.filter(
        e =>
          e.productoElaborado?.idProducto === dulce?.idProducto
      );


      setRegistros(
        elaboracionesDulce.map(convertirRegistro)
      );

    } catch (error) {

      console.error(
        "Error cargando datos de dulce de leche:",
        error
      );

    } finally {

      setCargando(false);

    }
  }


  // =====================================================
  // CONVERTIR ELABORACION DEL BACKEND AL FORMATO DEL FRONT
  // =====================================================

  function convertirRegistro(elaboracion) {

    const detalles = elaboracion.detalles || [];


    const detalleLeche = detalles.find(
      d =>
        d.insumoUtilizado?.idProducto ===
        productoLeche?.idProducto
    );

    const detalleAzucar = detalles.find(
      d =>
        d.insumoUtilizado?.idProducto ===
        productoAzucar?.idProducto
    );

    const detalleBicarbonato = detalles.find(
      d =>
        d.insumoUtilizado?.idProducto ===
        productoBicarbonato?.idProducto
    );


    return {
      idElaboracion: elaboracion.idElaboracion,

      fecha: elaboracion.fechaElaboracion || "",

      litrosLeche:
        detalleLeche?.cantidadUtilizada ?? "",

      cantidadAzucar:
        detalleAzucar?.cantidadUtilizada ?? "",

      cantidadBicarbonato:
        detalleBicarbonato?.cantidadUtilizada ?? "",

      tiempoElaboracion:
        elaboracion.tiempoElaboracion ?? "",

      cantFrascos1kg:
        elaboracion.cantidadFrascos1kg ?? "",

      cantFrascos420g:
        elaboracion.cantidadFrascos420g ?? "",

      comentario:
        elaboracion.observaciones ?? ""
    };
  }


  // =====================================================
  // CAMBIAR CAMPOS
  // =====================================================

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  }


  // =====================================================
  // OBTENER USUARIO LOGUEADO
  // =====================================================

  function obtenerUsuario() {

    try {

      const usuarioGuardado =
        localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        return null;
      }

      const usuario =
        JSON.parse(usuarioGuardado);

      return usuario;

    } catch (error) {

      console.error(
        "Error leyendo usuario:",
        error
      );

      return null;
    }
  }


  // =====================================================
  // GUARDAR
  // =====================================================

  async function guardar(e) {

    e.preventDefault();


    if (!productoDulce) {

      alert(
        "No se encontró el producto Dulce de Leche."
      );

      return;
    }


    if (!productoLeche) {

      alert(
        "No se encontró el producto Leche."
      );

      return;
    }


    if (!productoAzucar) {

      alert(
        "No se encontró el producto Azúcar."
      );

      return;
    }


    if (!productoBicarbonato) {

      alert(
        "No se encontró el producto Bicarbonato."
      );

      return;
    }


    const usuario = obtenerUsuario();


    if (!usuario?.idUsuario) {

      alert(
        "No se encontró el usuario logueado."
      );

      return;
    }


    // =================================================
    // CALCULAR CANTIDAD PRODUCIDA
    // =================================================

    const frascos1kg =
      Number(form.cantFrascos1kg) || 0;

    const frascos420g =
      Number(form.cantFrascos420g) || 0;


    const cantidadProducida =
      frascos1kg +
      (frascos420g * 0.420);


    // =================================================
    // CREAR DETALLES
    // =================================================

    const detalles = [

      {
        insumoUtilizado: {
          idProducto: productoLeche.idProducto
        },
        cantidadUtilizada:
          Number(form.litrosLeche)
      },

      {
        insumoUtilizado: {
          idProducto: productoAzucar.idProducto
        },
        cantidadUtilizada:
          Number(form.cantidadAzucar)
      },

      {
        insumoUtilizado: {
          idProducto: productoBicarbonato.idProducto
        },
        cantidadUtilizada:
          Number(form.cantidadBicarbonato)
      }

    ];


    // =================================================
    // OBJETO PARA BACKEND
    // =================================================

    const elaboracion = {

      productoElaborado: {
        idProducto: productoDulce.idProducto
      },

      fechaElaboracion:
        form.fecha,

      tiempoElaboracion:
        Number(form.tiempoElaboracion),

      cantidadProducida:
        cantidadProducida,

      cantidadFrascos1kg:
        frascos1kg,

      cantidadFrascos420g:
        frascos420g,

      usuario: {
        idUsuario: usuario.idUsuario
      },

      observaciones:
        form.comentario,

      detalles:
        detalles
    };


    try {

      if (editando !== null) {

        await api.put(
          `/elaboraciones/${editando}`,
          elaboracion
        );

      } else {

        await api.post(
          "/elaboraciones",
          elaboracion
        );

      }


      // Recargar desde la BD
      await cargarDatos();


      // Limpiar
      setForm(formularioInicial);

      setEditando(null);


      alert(
        editando !== null
          ? "Elaboración actualizada correctamente."
          : "Elaboración guardada correctamente."
      );


    } catch (error) {

      console.error(
        "Error guardando elaboración:",
        error
      );

      console.error(
        "Respuesta del backend:",
        error.response?.data
      );


      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Error al guardar la elaboración."
      );

    }

  }


  // =====================================================
  // EDITAR
  // =====================================================

  function editarRegistro(registro) {

    setForm({
      fecha: registro.fecha,
      litrosLeche: registro.litrosLeche,
      cantidadAzucar: registro.cantidadAzucar,
      cantidadBicarbonato: registro.cantidadBicarbonato,
      tiempoElaboracion: registro.tiempoElaboracion,
      cantFrascos1kg: registro.cantFrascos1kg,
      cantFrascos420g: registro.cantFrascos420g,
      comentario: registro.comentario
    });


    setEditando(
      registro.idElaboracion
    );

  }


  // =====================================================
  // ELIMINAR
  // =====================================================

  async function eliminarRegistro(id) {

    const confirmar =
      window.confirm(
        "¿Está seguro de eliminar esta elaboración?"
      );


    if (!confirmar) {
      return;
    }


    try {

      await api.delete(
        `/elaboraciones/${id}`
      );


      await cargarDatos();


    } catch (error) {

      console.error(
        "Error eliminando elaboración:",
        error
      );


      alert(
        "No se pudo eliminar la elaboración."
      );

    }

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="pagina">

      <Card title="· REGISTRO DE ELABORACION DE DULCE DE LECHE ·">

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

            <label>Leche (Litros)</label>

            <Input
              type="number"
              step="0.01"
              min="0"
              name="litrosLeche"
              value={form.litrosLeche}
              onChange={handleChange}
              required
            />

          </div>


          <div className="input-group">

            <label>Azúcar (Kg)</label>

            <Input
              type="number"
              step="0.01"
              min="0"
              name="cantidadAzucar"
              value={form.cantidadAzucar}
              onChange={handleChange}
              required
            />

          </div>


          <div className="input-group">

            <label>Bicarbonato (Grs)</label>

            <Input
              type="number"
              step="0.01"
              min="0"
              name="cantidadBicarbonato"
              value={form.cantidadBicarbonato}
              onChange={handleChange}
              required
            />

          </div>


          <div className="input-group">

            <label>
              Tiempo de elaboración (minutos)
            </label>

            <Input
              type="number"
              min="0"
              name="tiempoElaboracion"
              value={form.tiempoElaboracion}
              onChange={handleChange}
              required
            />

          </div>


          <div className="input-group">

            <label>Frascos 1 kg</label>

            <Input
              type="number"
              min="0"
              name="cantFrascos1kg"
              value={form.cantFrascos1kg}
              onChange={handleChange}
              required
            />

          </div>


          <div className="input-group">

            <label>Frascos 420 g</label>

            <Input
              type="number"
              min="0"
              name="cantFrascos420g"
              value={form.cantFrascos420g}
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

                <th>Fecha</th>

                <th>Leche</th>

                <th>Azúcar</th>

                <th>Bicarbonato</th>

                <th>
                  Tiempo de elaboración
                </th>

                <th>
                  Frascos 1 kg
                </th>

                <th>
                  Frascos 420 g
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

              {cargando ? (

                <tr>

                  <td colSpan="9">
                    Cargando...
                  </td>

                </tr>

              ) : registros.length === 0 ? (

                <tr>

                  <td colSpan="9">
                    No hay elaboraciones registradas.
                  </td>

                </tr>

              ) : (

                registros.map((r) => (

                  <tr
                    key={r.idElaboracion}
                  >

                    <td>
                      {r.fecha}
                    </td>

                    <td>
                      {r.litrosLeche}
                    </td>

                    <td>
                      {r.cantidadAzucar}
                    </td>

                    <td>
                      {r.cantidadBicarbonato}
                    </td>

                    <td>
                      {r.tiempoElaboracion}
                    </td>

                    <td>
                      {r.cantFrascos1kg}
                    </td>

                    <td>
                      {r.cantFrascos420g}
                    </td>

                    <td>
                      {r.comentario}
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
                              r.idElaboracion
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


