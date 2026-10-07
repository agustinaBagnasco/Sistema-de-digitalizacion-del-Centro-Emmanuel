import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import api from "../../services/api";
import { mensajeError, puedeModificarRegistro } from "../../utils/errores";

function normalizarTexto(texto) {
  return texto
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

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

  const [productoDulce, setProductoDulce] = useState(null);
  const [productoDulce1kg, setProductoDulce1kg] = useState(null);
  const [productoDulce420g, setProductoDulce420g] = useState(null);
  const [productoLeche, setProductoLeche] = useState(null);
  const [productoAzucar, setProductoAzucar] = useState(null);
  const [productoBicarbonato, setProductoBicarbonato] = useState(null);
  const [inventarioLeche, setInventarioLeche] = useState(null);

  const [editando, setEditando] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // 1 litro de leche rinde como máximo 1 kg de dulce de leche
  const kilosIngredientes = Number(form.litrosLeche) || 0;
  const frascos1kgActuales = Number(form.cantFrascos1kg) || 0;
  const frascos420gActuales = Number(form.cantFrascos420g) || 0;
  const maxFrascos1kg = Math.max(
    Math.floor(kilosIngredientes - frascos420gActuales * 0.420 + 0.000001),
    0
  );
  const maxFrascos420g = Math.max(
    Math.floor((kilosIngredientes - frascos1kgActuales) / 0.420 + 0.000001),
    0
  );


  // CARGAR DATOS INICIALES
  useEffect(() => {
    cargarDatos();
  }, []);


  async function cargarDatos() {

    try {

      setCargando(true);

      const [respuestaProductos, respuestaElaboraciones, respuestaInventario] =
        await Promise.all([
          api.get("/productos"),
          api.get("/elaboraciones"),
          api.get("/produccion-leche/inventario")
        ]);


      const listaProductos = Array.isArray(respuestaProductos.data)
        ? respuestaProductos.data
        : [];


      const listaElaboraciones =
        Array.isArray(respuestaElaboraciones.data)
          ? respuestaElaboraciones.data
          : [];
      setInventarioLeche(respuestaInventario.data);


      // BUSCAR PRODUCTOS
      const productosDulce = listaProductos.filter(
        p =>
          p.categoria === "DULCEDELECHE" &&
          p.activo === true
      );

      const dulce1kg = productosDulce.find((producto) =>
        /(?:^|\D)(?:1\s*kg|1000\s*g)(?:\D|$)/i.test(producto.nombreProducto || "")
      );
      const dulce420g = productosDulce.find((producto) =>
        /(?:420\s*g|0[,.]?420\s*kg|1\s*\/\s*2\s*kg)/i.test(producto.nombreProducto || "")
      );
      const dulce = dulce1kg || dulce420g || productosDulce[0];

      const leche = listaProductos.find(
        p =>
          p.categoria === "LECHE" &&
          p.activo === true
      );

      const azucar = listaProductos.find(
        p =>
          normalizarTexto(p.nombreProducto).includes("azucar")
      );

      const bicarbonato = listaProductos.find(
        p =>
          p.nombreProducto?.toLowerCase().includes("bicarbonato")
      );


      setProductoDulce(dulce || null);
      setProductoDulce1kg(dulce1kg || null);
      setProductoDulce420g(dulce420g || null);
      setProductoLeche(leche || null);
      setProductoAzucar(azucar || null);
      setProductoBicarbonato(bicarbonato || null);


      // MOSTRAR SOLAMENTE ELABORACIONES DE DULCE DE LECHE
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


  // CONVERTIR ELABORACION DEL BACKEND AL FORMATO DEL FRONT
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


  // CAMBIAR CAMPOS
  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  }


  // OBTENER USUARIO LOGUEADO
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


  // GUARDAR
  async function guardar(e) {

    e.preventDefault();


    if (!productoDulce) {

      alert(
        "No se encontró el producto Dulce de Leche."
      );

      return;
    }

    const frascos1kg = Number(form.cantFrascos1kg) || 0;
    const frascos420g = Number(form.cantFrascos420g) || 0;
    const litrosLeche = Number(form.litrosLeche);
    const cantidadAzucar = Number(form.cantidadAzucar);
    const cantidadBicarbonato = Number(form.cantidadBicarbonato);
    const disponibleDulce = Number(inventarioLeche?.areas
      ?.find(area => area.destino === "DULCE_DE_LECHE")?.disponible) || 0;

    if (
      !Number.isFinite(litrosLeche) || litrosLeche <= 0 ||
      !Number.isFinite(cantidadAzucar) || cantidadAzucar < 0 ||
      !Number.isFinite(cantidadBicarbonato) || cantidadBicarbonato < 0 ||
      frascos1kg < 0 || frascos420g < 0
    ) {
      alert("Revise las cantidades: la leche debe ser mayor que cero y los demás valores no pueden ser negativos.");
      return;
    }

    if (frascos1kg > 0 && !productoDulce1kg) {
      alert("No se encontró un producto activo de Dulce de Leche de 1 kg.");
      return;
    }

    if (frascos420g > 0 && !productoDulce420g) {
      alert("No se encontró un producto activo de Dulce de Leche de 420 g.");
      return;
    }

    if (frascos1kg === 0 && frascos420g === 0) {
      alert("Ingrese la cantidad producida de al menos una presentación.");
      return;
    }

    const masaProducida = frascos1kg + frascos420g * 0.420;
    if (masaProducida > litrosLeche + 0.000001) {
      alert(`Con ${litrosLeche} L de leche se pueden producir como máximo ${litrosLeche.toFixed(3)} kg de dulce de leche (${masaProducida.toFixed(3)} kg ingresados).`);
      return;
    }


    if (!productoLeche) {

      alert(
        "No se encontró el producto Leche."
      );

      return;
    }

    if (litrosLeche > disponibleDulce) {
      alert(`Solo hay ${disponibleDulce} litros disponibles para dulce de leche.`);
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

    if (
      litrosLeche > (Number(productoLeche.stockActual) || 0) ||
      cantidadAzucar > (Number(productoAzucar.stockActual) || 0) ||
      cantidadBicarbonato > (Number(productoBicarbonato.stockActual) || 0)
    ) {
      alert("Una o más cantidades superan el stock disponible de los insumos.");
      return;
    }


    const usuario = obtenerUsuario();


    if (!usuario?.idUsuario) {

      alert(
        "No se encontró el usuario logueado."
      );

      return;
    }


    // CALCULAR CANTIDAD PRODUCIDA
    const cantidadProducida =
      masaProducida;


    // CREAR DETALLES
    const detalles = [

      {
        insumoUtilizado: {
          idProducto: productoLeche.idProducto
        },
        cantidadUtilizada:
          litrosLeche
      },

      {
        insumoUtilizado: {
          idProducto: productoAzucar.idProducto
        },
        cantidadUtilizada:
          cantidadAzucar
      },

      {
        insumoUtilizado: {
          idProducto: productoBicarbonato.idProducto
        },
        cantidadUtilizada:
          cantidadBicarbonato
      }

    ];


    // OBJETO PARA BACKEND
    const elaboracion = {

      productoElaborado: {
        idProducto: (productoDulce1kg || productoDulce420g || productoDulce).idProducto
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

      productoElaborado1kg: frascos1kg > 0
        ? { idProducto: productoDulce1kg.idProducto }
        : null,

      productoElaborado420g: frascos420g > 0
        ? { idProducto: productoDulce420g.idProducto }
        : null,

      usuario: {
        idUsuario: usuario.idUsuario
      },

      observaciones:
        form.comentario,

      detalles:
        detalles
    };


    try {
      setGuardando(true);

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


      alert(mensajeError(error, "Error al guardar la elaboración."));

    } finally {
      setGuardando(false);

    }

  }


  // EDITAR
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


  // ELIMINAR
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


      alert(mensajeError(error, "No se pudo eliminar la elaboración."));

    }

  }


  // RENDER
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
            <small>
              Disponibles para dulce de leche: {inventarioLeche?.areas
                ?.find(area => area.destino === "DULCE_DE_LECHE")?.disponible ?? 0} L
            </small>

            <Input
              type="number"
              step="0.01"
              min="0"
              max={Math.min(
                Number(productoLeche?.stockActual) || 0,
                Number(inventarioLeche?.areas?.find(area => area.destino === "DULCE_DE_LECHE")?.disponible) || 0
              )}
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
              max={productoAzucar?.stockActual ?? 0}
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
              max={productoBicarbonato?.stockActual ?? 0}
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
            <small>Máximo según la leche utilizada: {maxFrascos1kg}</small>

            <Input
              type="number"
              min="0"
              max={maxFrascos1kg}
              name="cantFrascos1kg"
              value={form.cantFrascos1kg}
              onChange={handleChange}
              required
            />

          </div>


          <div className="input-group">

            <label>Frascos 420 g</label>
            <small>Máximo según la leche utilizada: {maxFrascos420g}</small>

            <Input
              type="number"
              min="0"
              max={maxFrascos420g}
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

                ))

              )}

            </tbody>

          </table>

        </div>

      </Card>

    </div>

  );
}
