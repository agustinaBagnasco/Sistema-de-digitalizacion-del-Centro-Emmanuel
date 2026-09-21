// import { useEffect, useState } from "react";
// import Card from "../../components/ui/Card";
// import Select from "../../components/ui/Select";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";
// import Textarea from "../../components/ui/Textarea";
// import FormField from '../../components/ui/FormField';
// import api from "../../services/api";

// export default function Quesos() {
//   const [form, setForm] = useState({
//     fecha: "",
//     cantidad: "",
//     queso: "",
//     comentario: "",
//   });

//   const [productos, setProductos] = useState([]);
//   const [registros, setRegistros] = useState([]);
//   const [editando, setEditando] = useState(null);

//   useEffect(() => {
//     cargarProductos();
//   }, []);

//   const opcionesQuesos = productos
//     .filter(producto => producto.categoria === "QUESO")
//     .map(producto => ({
//       value: producto.idProducto,
//       label: producto.nombreProducto,
//     }));

//   async function cargarProductos() {
//     try {
//       const respuesta = await api.get("/productos");
//       setProductos(respuesta.data);
//     } catch (error) {
//       console.error("Error al cargar productos:", error);
//     }
//   }

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
//       cantidad: "",
//       queso: "",
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
//       cantidad: "",
//       queso: "",
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
//       <Card title="· REGISTRO DE ELABORACION DE QUESOS ·">
//         <form onSubmit={guardar} className="form-field columns-2">

//           <div className="input-group">
//             <label>Fecha</label>
//             <Input
//               type="date"
//               name="fecha"
//               value={form.fecha}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <label>Tipo de queso</label>
//             <Select
//               name="queso"
//               value={form.queso}
//               onChange={handleChange}
//               options={opcionesQuesos}
//               placeholder="Seleccione un tipo de queso"
//             />
//           </div>
//           <div className="input-group">

//             <label>Cantidad (hormas)</label>
//             <Input
//               type="number"
//               name="cantidad"
//               value={form.cantidad}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <label>Comentario</label>
//             <Textarea
//               name="comentario"
//               value={form.comentario}
//               onChange={handleChange}
//               placeholder="Ingrese observaciones..."
//             />
//           </div>
//           <div className="form-button-container">
//             <Button
//               type={"submit"}
//               className={`btn btn-${"primary"}`}>
//               Guardar
//             </Button>
//           </div>

//         </form>
//         <br />
//         <hr />


//         <div className="table-container">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Fecha</th>
//                 <th>Cantidad </th>
//                 <th>Tipo de queso</th>
//                 <th>Comentario</th>
//               </tr>
//             </thead>

//             <tbody>
//               {registros.map((r, i) => (
//                 <tr key={i}>
//                   <td>{r.fecha}</td>
//                   <td>{r.cantidad}</td>
//                   <td>{opcionesQuesos.find(o => String(o.value) === String(r.queso))?.label}</td>
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
//     </div >

//   );
// }




import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import api from "../../services/api";

export default function Quesos() {
  const [form, setForm] = useState({
    fecha: "",
    cantidad: "",
    queso: "",
    comentario: "",
  });

  const [productos, setProductos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);

  // =========================
  // CARGA INICIAL
  // =========================

  useEffect(() => {
    cargarProductos();
    cargarElaboraciones();
  }, []);

  // =========================
  // PRODUCTOS - SOLO QUESOS
  // =========================

  const opcionesQuesos = productos
    .filter(
      producto =>
        producto.categoria === "QUESO" &&
        producto.activo === true
    )
    .map(producto => ({
      value: producto.idProducto,
      label: producto.nombreProducto,
    }));

  async function cargarProductos() {
    try {
      const respuesta = await api.get("/productos");
      setProductos(respuesta.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  // =========================
  // CARGAR ELABORACIONES
  // =========================

  async function cargarElaboraciones() {
    try {
      const respuesta = await api.get("/elaboraciones");

      // Solo mostramos elaboraciones de quesos
      const elaboracionesQuesos = respuesta.data.filter(
        elaboracion =>
          elaboracion.productoElaborado?.categoria === "QUESO"
      );

      setRegistros(elaboracionesQuesos);
    } catch (error) {
      console.error("Error al cargar elaboraciones:", error);
    }
  }

  // =========================
  // CAMBIOS DEL FORMULARIO
  // =========================

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // =========================
  // GUARDAR
  // =========================

  async function guardar(e) {
    e.preventDefault();

    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      if (!usuario?.idUsuario) {
        alert("No se pudo identificar el usuario.");
        return;
      }

      const datos = {
        productoElaborado: {
          idProducto: Number(form.queso),
        },

        fechaElaboracion: form.fecha,

        cantidadProducida: Number(form.cantidad),

        observaciones: form.comentario,

        usuario: {
          idUsuario: usuario.idUsuario,
        },
      };

      if (editando) {
        await api.put(
          `/elaboraciones/${editando.idElaboracion}`,
          datos
        );
      } else {
        await api.post("/elaboraciones", datos);
      }

      await cargarElaboraciones();

      limpiarFormulario();

      setEditando(null);

    } catch (error) {
      console.error("Error al guardar elaboración:", error);

      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
      }

      alert("No se pudo guardar la elaboración.");
    }
  }

  // =========================
  // EDITAR
  // =========================

  function editarRegistro(registro) {
    setForm({
      fecha: registro.fechaElaboracion || "",
      cantidad: registro.cantidadProducida || "",
      queso: registro.productoElaborado?.idProducto || "",
      comentario: registro.observaciones || "",
    });

    setEditando(registro);
  }

  // =========================
  // ELIMINAR
  // =========================

  async function eliminarRegistro(id) {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar esta elaboración?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/elaboraciones/${id}`);

      await cargarElaboraciones();

    } catch (error) {
      console.error("Error al eliminar elaboración:", error);

      alert("No se pudo eliminar la elaboración.");
    }
  }

  // =========================
  // LIMPIAR FORMULARIO
  // =========================

  function limpiarFormulario() {
    setForm({
      fecha: "",
      cantidad: "",
      queso: "",
      comentario: "",
    });
  }

  // =========================
  // CANCELAR EDICIÓN
  // =========================

  function cancelarEdicion() {
    limpiarFormulario();
    setEditando(null);
  }

  return (
    <div className="pagina">

      <Card title="· REGISTRO DE ELABORACION DE QUESOS ·">

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


          {/* TIPO DE QUESO */}
          <div className="input-group">
            <label>Tipo de queso</label>

            <Select
              name="queso"
              value={form.queso}
              onChange={handleChange}
              options={opcionesQuesos}
              placeholder="Seleccione un tipo de queso"
              required
            />
          </div>


          {/* CANTIDAD */}
          <div className="input-group">

            <label>Cantidad (hormas)</label>

            <Input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              min="1"
              step="1"
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
              {editando ? "Actualizar" : "Guardar"}
            </Button>

            {editando && (
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

          <table className="table">

            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Tipo de queso</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>
            </thead>


            <tbody>

              {registros.length === 0 ? (

                <tr>
                  <td colSpan="5">
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
                      {registro.cantidadProducida}
                    </td>

                    <td>
                      {registro.productoElaborado?.nombreProducto}
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
                            eliminarRegistro(
                              registro.idElaboracion
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

