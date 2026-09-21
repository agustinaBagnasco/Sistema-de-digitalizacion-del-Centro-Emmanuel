// import { useState } from "react";
// import Card from "../../components/ui/Card";
// import Select from "../../components/ui/Select";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";
// import Textarea from "../../components/ui/Textarea";
// import FormField from '../../components/ui/FormField'

// export default function Quark() {
//   const [form, setForm] = useState({
//     fecha: "",
//     litrosLeche: "",
//     cantFrascos: "",
//     tiempoElaboracion: "",
//     comentario: "",
//   });

//   const [registros, setRegistros] = useState([]);
//   const [editando, setEditando] = useState(null);

//   function handleChange(e) {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   }

//   function guardar(e) {
//     e.preventDefault();

//     setRegistros([...registros, form]);

//     setForm({
//       fecha: "",
//       litrosLeche: "",
//       cantFrascos: "",
//       tiempoElaboracion: "",
//       comentario: "",
//     });
//   }

//   function guardarRegistro() {
//     if (editando !== null) {
//       const nuevos = [...registros];
//       nuevos[editando] = form;
//       setRegistros(nuevos);
//       setEditando(null);
//     } else {
//       setRegistros([...registros, form]);
//     }

//     setForm({
//       fecha: "",
//       litrosLeche: "",
//       cantFrascos: "",
//       tiempoElaboracion: "",
//       comentario: "",
//     });
//   }

//   function editarRegistro(indice) {
//     setForm(registros[indice]);
//     setEditando(indice);
//   }

//   function eliminarRegistro(indice) {
//     setRegistros(registros.filter((_, i) => i !== indice));
//   }

//   return (
//     <div className="pagina">
//       <Card title="· REGISTRO DE ELABORACION DE QUARK ·">
//         <form onSubmit={guardar} className="form-field columns-2">
//   <div className="input-group">
//           <label>Fecha</label>
//           <Input
//             type="date"
//             name="fecha"
//             value={form.fecha}
//             onChange={handleChange}
//             required
//           />
//           </div>
//             <div className="input-group">

//           <label>Leche (Lts)</label>
//           <Input
//             type="number"
//             name="litrosLeche"
//             value={form.litrosLeche}
//             onChange={handleChange}
//             required
//           />
//           </div>
//             <div className="input-group">

//           <label>Cantidad de Frascos</label>
//           <Input
//             type="number"
//             name="cantFrascos"
//             value={form.cantFrascos}
//             onChange={handleChange}
//             required
//           />
//           </div>
//             <div className="input-group">


//           <label>Tiempo de elaboracion</label>
//           <Input
//             type="number"
//             name="tiempoElaboracion"
//             value={form.tiempoElaboracion}
//             onChange={handleChange}
//             required
//           />
//           </div>

//             <div className="input-group">
//           <label>Comentario</label>
//           <Textarea
//             name="comentario"
//             value={form.comentario}
//             onChange={handleChange}
//             placeholder="Ingrese observaciones..."
//           />
//           </div>
//         <div className="form-button-container">
//           <Button
//             type={"submit"}
//             className={`btn btn-${"primary"}`}>
//             Guardar
//           </Button>
// </div>
//         </form>
//         <br />
//         <hr />


//         <div className="table-container">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Fecha</th>
//                 <th>Leche</th>
//                 <th>Cantidad de Frascos</th>
//                 <th>Tiempo de elaboracion</th>
//                 <th>Comentario</th>
//               </tr>
//             </thead>

//             <tbody>
//               {registros.map((r, i) => (
//                 <tr key={i}>
//                   <td>{r.fecha}</td>
//                   <td>{r.litrosLeche}</td>
//                   <td>{r.cantFrascos}</td>
//                   <td>{r.tiempoElaboracion}</td>
//                   <td>{r.comentario}</td>
//                   <td>
//                     <div className="table-actions">
//                       <Button
//                         variant="secondary"
//                         onClick={() => editarRegistro(i)}
//                       >
//                         Editar
//                       </Button>

//                       <Button
//                         variant="danger"
//                         onClick={() => eliminarRegistro(i)}
//                       >
//                         Eliminar
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>

//   );
// }





import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import api from "../../services/api";

export default function Quark() {

  const [form, setForm] = useState({
    fecha: "",
    litrosLeche: "",
    cantFrascos: "",
    tiempoElaboracion: "",
    comentario: "",
  });

  const [registros, setRegistros] = useState([]);
  const [productoQuark, setProductoQuark] = useState(null);
  const [productoLeche, setProductoLeche] = useState(null);
  const [editando, setEditando] = useState(null);

  // =========================
  // CARGAR DATOS
  // =========================

  useEffect(() => {
    cargarProductos();
    cargarElaboraciones();
  }, []);

  async function cargarProductos() {
    try {
      const response = await api.get("/productos");

      const productos = response.data;

      // Producto elaborado: Quark
      const quark = productos.find(
        (p) =>
          p.nombreProducto?.toLowerCase().includes("quark") &&
          p.activo === true
      );

      // Insumo: Leche
      const leche = productos.find(
        (p) =>
          p.categoria === "LECHE" &&
          p.activo === true
      );

      setProductoQuark(quark);
      setProductoLeche(leche);

      if (!quark) {
        console.warn("No se encontró el producto Quark.");
      }

      if (!leche) {
        console.warn("No se encontró el producto Leche.");
      }

    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  async function cargarElaboraciones() {
    try {
      const response = await api.get("/elaboraciones");

      const elaboraciones = response.data;

      const quarks = elaboraciones.filter(
        (e) =>
          e.productoElaborado &&
          e.productoElaborado.idProducto
      );

      setRegistros(quarks);

    } catch (error) {
      console.error("Error al cargar elaboraciones:", error);
    }
  }

  // =========================
  // FORMULARIO
  // =========================

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function limpiarFormulario() {
    setForm({
      fecha: "",
      litrosLeche: "",
      cantFrascos: "",
      tiempoElaboracion: "",
      comentario: "",
    });

    setEditando(null);
  }

  // =========================
  // USUARIO LOGUEADO
  // =========================

  function obtenerUsuario() {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      return null;
    }

    try {
      return JSON.parse(usuarioGuardado);
    } catch (error) {
      console.error("Error leyendo usuario:", error);
      return null;
    }
  }

  // =========================
  // GUARDAR
  // =========================

  async function guardar(e) {
    e.preventDefault();

    try {

      if (!productoQuark) {
        alert("No se encontró el producto Quark.");
        return;
      }

      if (!productoLeche) {
        alert("No se encontró el producto Leche.");
        return;
      }

      const usuario = obtenerUsuario();

      if (!usuario || !usuario.idUsuario) {
        alert("No se encontró el usuario logueado.");
        return;
      }

      const elaboracion = {
        productoElaborado: {
          idProducto: productoQuark.idProducto,
        },

        fechaElaboracion: form.fecha,

        tiempoElaboracion:
          Number(form.tiempoElaboracion),

        // Para Quark usamos cantidad producida
        // como cantidad de frascos.
        cantidadProducida:
          Number(form.cantFrascos),

        cantidadFrascos1kg: null,
        cantidadFrascos420g: null,

        usuario: {
          idUsuario: usuario.idUsuario,
        },

        observaciones: form.comentario,

        detalles: [
          {
            insumoUtilizado: {
              idProducto: productoLeche.idProducto,
            },

            cantidadUtilizada:
              Number(form.litrosLeche),
          },
        ],
      };

      if (editando) {

        await api.put(
          `/elaboraciones/${editando.idElaboracion}`,
          elaboracion
        );

      } else {

        await api.post(
          "/elaboraciones",
          elaboracion
        );
      }

      await cargarElaboraciones();

      limpiarFormulario();

      alert("Elaboración de Quark guardada correctamente.");

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
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        "Error al guardar la elaboración."
      );
    }
  }

  // =========================
  // EDITAR
  // =========================

  function editarRegistro(registro) {

    const detalleLeche =
      registro.detalles?.find(
        (detalle) =>
          detalle.insumoUtilizado?.idProducto ===
          productoLeche?.idProducto
      );

    setForm({
      fecha: registro.fechaElaboracion || "",

      litrosLeche:
        detalleLeche?.cantidadUtilizada ?? "",

      cantFrascos:
        registro.cantidadProducida ?? "",

      tiempoElaboracion:
        registro.tiempoElaboracion ?? "",

      comentario:
        registro.observaciones || "",
    });

    setEditando(registro);
  }

  // =========================
  // ELIMINAR
  // =========================

  async function eliminarRegistro(id) {

    if (!window.confirm(
      "¿Está seguro de eliminar esta elaboración?"
    )) {
      return;
    }

    try {

      await api.delete(
        `/elaboraciones/${id}`
      );

      await cargarElaboraciones();

    } catch (error) {

      console.error(
        "Error al eliminar:",
        error
      );

      alert(
        "No se pudo eliminar la elaboración."
      );
    }
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="pagina">

      <Card title="· REGISTRO DE ELABORACIÓN DE QUARK ·">

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
            <label>Leche (Lts)</label>

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
            <label>Cantidad de Frascos</label>

            <Input
              type="number"
              min="0"
              name="cantFrascos"
              value={form.cantFrascos}
              onChange={handleChange}
              required
            />
          </div>


          <div className="input-group">
            <label>
              Tiempo de elaboración (min)
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
              {editando ? "Actualizar" : "Guardar"}
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
                <th>Leche (Lts)</th>
                <th>Frascos</th>
                <th>Tiempo</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>

            </thead>


            <tbody>

              {registros
                .filter(
                  (r) =>
                    r.productoElaborado?.idProducto ===
                    productoQuark?.idProducto
                )
                .map((r) => {

                  const detalleLeche =
                    r.detalles?.find(
                      (detalle) =>
                        detalle.insumoUtilizado?.idProducto ===
                        productoLeche?.idProducto
                    );

                  return (
                    <tr key={r.idElaboracion}>

                      <td>
                        {r.fechaElaboracion}
                      </td>

                      <td>
                        {detalleLeche?.cantidadUtilizada ?? ""}
                      </td>

                      <td>
                        {r.cantidadProducida}
                      </td>

                      <td>
                        {r.tiempoElaboracion} min
                      </td>

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