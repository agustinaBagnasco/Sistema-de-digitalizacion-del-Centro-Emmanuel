// import { useEffect, useState } from "react";
// import api from "../../services/api";
// import "../../pages/administracion/Usuarios.css";
// import { useNavigate } from "react-router-dom";

// function Usuarios() {

//   const navigate = useNavigate();

//   const [usuarios, setUsuarios] = useState([]);

//   const [mostrarFormulario, setMostrarFormulario] = useState(false);

//   const [modoEdicion, setModoEdicion] = useState(false);

//   const [usuarioEditando, setUsuarioEditando] = useState(null);

//   const [formulario, setFormulario] = useState({
//     nombreUsuario: "",
//     nombre: "",
//     apellido: "",
//     clave: "",
//     email: "",
//     activo: true
//   });


//   // ==========================================
//   // OBTENER USUARIOS
//   // ==========================================

//   const cargarUsuarios = async () => {

//     try {

//       const respuesta = await api.get("/usuarios");

//       setUsuarios(respuesta.data);

//     } catch (error) {

//       console.error("Error al obtener usuarios:", error);

//     }

//   };


//   // ==========================================
//   // CARGAR USUARIOS AL ENTRAR A LA PÁGINA
//   // ==========================================

//   useEffect(() => {

//     cargarUsuarios();

//   }, []);


//   // ==========================================
//   // CAMBIAR VALORES DEL FORMULARIO
//   // ==========================================

//   const manejarCambio = (e) => {

//     const { name, value } = e.target;

//     setFormulario({
//       ...formulario,
//       [name]: value
//     });

//   };


//   // ==========================================
//   // NUEVO USUARIO
//   // ==========================================

//   const nuevoUsuario = () => {

//     setModoEdicion(false);

//     setUsuarioEditando(null);

//     setFormulario({
//       nombreUsuario: "",
//       nombre: "",
//       apellido: "",
//       clave: "",
//       email: "",
//       activo: true
//     });

//     setMostrarFormulario(true);

//   };


//   // ==========================================
//   // EDITAR USUARIO
//   // ==========================================

//   const editarUsuario = (usuario) => {

//     setModoEdicion(true);

//     setUsuarioEditando(usuario);

//     setFormulario({
//       nombreUsuario: usuario.nombreUsuario || "",
//       nombre: usuario.nombre || "",
//       apellido: usuario.apellido || "",
//       clave: "",
//       email: usuario.email || "",
//       activo: usuario.activo
//     });

//     setMostrarFormulario(true);

//   };


//   // ==========================================
//   // GUARDAR USUARIO
//   // ==========================================

//   const guardarUsuario = async (e) => {

//     e.preventDefault();

//     try {

//       if (modoEdicion) {

//         await api.put(
//           `/usuarios/${usuarioEditando.idUsuario}`,
//           formulario
//         );

//         alert("Usuario modificado correctamente");

//       } else {

//         await api.post(
//           "/usuarios",
//           formulario
//         );

//         alert("Usuario creado correctamente");

//       }

//       setMostrarFormulario(false);

//       cargarUsuarios();

//     } catch (error) {

//       console.error("Error al guardar usuario:", error);

//       alert("No se pudo guardar el usuario");

//     }

//   };


//   // ==========================================
//   // ELIMINAR USUARIO
//   // ==========================================

//   const eliminarUsuario = async (id) => {

//     const confirmar = window.confirm(
//       "¿Está seguro de que desea eliminar este usuario?"
//     );

//     if (!confirmar) {
//       return;
//     }

//     try {

//       await api.delete(`/usuarios/${id}`);

//       alert("Usuario eliminado correctamente");

//       cargarUsuarios();

//     } catch (error) {

//       console.error("Error al eliminar usuario:", error);

//       alert("No se pudo eliminar el usuario");

//     }

//   };


//   return (

//     <div className="usuarios-container">

//       <div className="usuarios-header">

//         <h2>Usuarios</h2>

//         <button onClick={nuevoUsuario}>
//           + Nuevo usuario
//         </button>

//          <button onClick={() => navigate("/administracion/usuarios/roles")}>
//       Gestionar roles
//     </button>

//       </div>


//       {/* ======================================
//           FORMULARIO
//       ====================================== */}

//       {mostrarFormulario && (

//         <div className="usuario-formulario">

//           <h3>
//             {modoEdicion
//               ? "Editar usuario"
//               : "Nuevo usuario"}
//           </h3>


//           <form onSubmit={guardarUsuario}>

//             <div>

//               <label>
//                 Usuario
//               </label>

//               <input
//                 type="text"
//                 name="nombreUsuario"
//                 value={formulario.nombreUsuario}
//                 onChange={manejarCambio}
//                 required
//               />

//             </div>


//             <div>

//               <label>
//                 Nombre
//               </label>

//               <input
//                 type="text"
//                 name="nombre"
//                 value={formulario.nombre}
//                 onChange={manejarCambio}
//                 required
//               />

//             </div>


//             <div>

//               <label>
//                 Apellido
//               </label>

//               <input
//                 type="text"
//                 name="apellido"
//                 value={formulario.apellido}
//                 onChange={manejarCambio}
//                 required
//               />

//             </div>


//             <div>

//               <label>
//                 Email
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 value={formulario.email}
//                 onChange={manejarCambio}
//               />

//             </div>


//             <div>

//               <label>
//                 Clave
//               </label>

//               <input
//                 type="password"
//                 name="clave"
//                 value={formulario.clave}
//                 onChange={manejarCambio}
//                 placeholder={
//                   modoEdicion
//                     ? "Dejar vacío para mantener la actual"
//                     : ""
//                 }
//                 required={!modoEdicion}
//               />

//             </div>


//             <div>

//               <label>
//                 Estado
//               </label>

//               <select
//                 name="activo"
//                 value={formulario.activo}
//                 onChange={(e) =>
//                   setFormulario({
//                     ...formulario,
//                     activo: e.target.value === "true"
//                   })
//                 }
//               >

//                 <option value="true">
//                   Activo
//                 </option>

//                 <option value="false">
//                   Inactivo
//                 </option>

//               </select>

//             </div>


//             <div className="formulario-botones">

//               <button type="submit">
//                 {modoEdicion
//                   ? "Guardar cambios"
//                   : "Crear usuario"}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setMostrarFormulario(false)}
//               >
//                 Cancelar
//               </button>

//             </div>

//           </form>

//         </div>

//       )}


//       {/* ======================================
//           TABLA
//       ====================================== */}

//       <table>

//         <thead>

//           <tr>

//             <th>Usuario</th>

//             <th>Nombre</th>

//             <th>Rol</th>

//             <th>Estado</th>

//             <th>Acciones</th>

//           </tr>

//         </thead>


//         <tbody>

//           {usuarios.map((u) => (

//             <tr key={u.idUsuario}>

//               <td>
//                 {u.nombreUsuario}
//               </td>


//               <td>
//                 {u.nombre} {u.apellido}
//               </td>


//               <td>

//                 {u.roles && u.roles.length > 0
//                   ? u.roles.map(rol => rol.nombreRol).join(", ")
//                   : "Sin rol"}

//               </td>


//               <td>

//                 {u.activo ? (

//                   <span className="activo">
//                     Activo
//                   </span>

//                 ) : (

//                   <span className="inactivo">
//                     Inactivo
//                   </span>

//                 )}

//               </td>


//               <td>

//                 <button
//                   className="editar"
//                   onClick={() => editarUsuario(u)}
//                 >
//                   Editar
//                 </button>


//                 <button
//                   className="eliminar"
//                   onClick={() => eliminarUsuario(u.idUsuario)}
//                 >
//                   Eliminar
//                 </button>

//               </td>

//             </tr>

//           ))}


//           {usuarios.length === 0 && (

//             <tr>

//               <td colSpan="5">
//                 No hay usuarios registrados.
//               </td>

//             </tr>

//           )}

//         </tbody>

//       </table>

//     </div>

//   );

// }

// export default Usuarios;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Usuarios.css";

function Usuarios() {

  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [clave, setClave] = useState("");
  const [email, setEmail] = useState("");
  const [activo, setActivo] = useState(true);
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);


  // =========================
  // CARGAR USUARIOS
  // =========================

  const cargarUsuarios = async () => {

    try {

      const respuesta = await api.get("/usuarios");

      setUsuarios(respuesta.data);

    } catch (error) {

      console.error("Error al cargar usuarios:", error);

    }

  };


  // =========================
  // CARGAR ROLES
  // =========================

  const cargarRoles = async () => {

    try {

      const respuesta = await api.get("/roles");

      setRoles(respuesta.data);

    } catch (error) {

      console.error("Error al cargar roles:", error);

    }

  };


  useEffect(() => {

    cargarUsuarios();
    cargarRoles();

  }, []);


  // =========================
  // NUEVO USUARIO
  // =========================

  const nuevoUsuario = () => {

    setUsuarioEditando(null);

    setNombreUsuario("");
    setNombre("");
    setApellido("");
    setClave("");
    setEmail("");
    setActivo(true);
    setRolesSeleccionados([]);

    setMostrarFormulario(true);

  };


  // =========================
  // EDITAR USUARIO
  // =========================

  const editarUsuario = (usuario) => {

    setUsuarioEditando(usuario);

    setNombreUsuario(usuario.nombreUsuario || "");
    setNombre(usuario.nombre || "");
    setApellido(usuario.apellido || "");
    setClave("");
    setEmail(usuario.email || "");
    setActivo(usuario.activo);

    if (usuario.roles && usuario.roles.length > 0) {

      setRolesSeleccionados(
        usuario.roles.map((rol) =>
          String(rol.idRol)
        )
      );

    } else {

      setRolesSeleccionados([]);

    }
    setMostrarFormulario(true);

  };


  // =========================
  // GUARDAR USUARIO
  // =========================

  const guardarUsuario = async (e) => {

    e.preventDefault();


    if (!nombreUsuario.trim()) {

      alert("Debe ingresar un nombre de usuario.");

      return;

    }


    if (rolesSeleccionados.length === 0) {

      alert("Debe seleccionar al menos un rol.");

      return;

    }


    const datosUsuario = {

      nombreUsuario: nombreUsuario.trim(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      clave: clave,
      email: email.trim(),
      activo: activo,

      roles: rolesSeleccionados.map((id) => ({
        idRol: Number(id)
      }))

    };


    try {

      if (usuarioEditando) {

        await api.put(
          `/usuarios/${usuarioEditando.idUsuario}`,
          datosUsuario
        );

        alert("Usuario modificado correctamente.");

      } else {

        await api.post(
          "/usuarios",
          datosUsuario
        );

        alert("Usuario creado correctamente.");

      }


      setMostrarFormulario(false);
      setUsuarioEditando(null);

      cargarUsuarios();

    } catch (error) {

      console.error("Error al guardar usuario:", error);

      alert("No se pudo guardar el usuario.");

    }

  };


  // =========================
  // ELIMINAR USUARIO
  // =========================

  const eliminarUsuario = async (id) => {

    const confirmar = window.confirm(
      "¿Está seguro de que desea eliminar este usuario?"
    );

    if (!confirmar) {
      return;
    }


    try {

      await api.delete(`/usuarios/${id}`);

      alert("Usuario eliminado correctamente.");

      cargarUsuarios();

    } catch (error) {

      console.error("Error al eliminar usuario:", error);

      alert("No se pudo eliminar el usuario.");

    }

  };


  return (

    <div className="usuarios-container">


      {/* =========================
          ENCABEZADO
      ========================= */}

      <div className="usuarios-header">

        <h2>Usuarios</h2>

        <div className="usuarios-header-buttons">

          <button
            onClick={() => navigate("/administracion/usuarios/roles")}
          >
            Gestionar roles
          </button>

          <button
            onClick={nuevoUsuario}
          >
            + Nuevo usuario
          </button>

        </div>

      </div>


      {/* =========================
          FORMULARIO
      ========================= */}

      {mostrarFormulario && (

        <div className="usuario-formulario">

          <h3>
            {usuarioEditando
              ? "Modificar usuario"
              : "Nuevo usuario"
            }
          </h3>


          <form onSubmit={guardarUsuario}>


            <div className="campo">

              <label>
                Usuario
              </label>

              <input
                type="text"
                value={nombreUsuario}
                onChange={(e) =>
                  setNombreUsuario(e.target.value)
                }
                placeholder="Nombre de usuario"
              />

            </div>


            <div className="campo">

              <label>
                Nombre
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
                placeholder="Nombre"
              />

            </div>


            <div className="campo">

              <label>
                Apellido
              </label>

              <input
                type="text"
                value={apellido}
                onChange={(e) =>
                  setApellido(e.target.value)
                }
                placeholder="Apellido"
              />

            </div>


            <div className="campo">

              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="correo@email.com"
              />

            </div>


            <div className="campo">

              <label>
                Clave
              </label>

              <input
                type="password"
                value={clave}
                onChange={(e) =>
                  setClave(e.target.value)
                }
                placeholder={
                  usuarioEditando
                    ? "Dejar vacío para mantener la actual"
                    : "Contraseña"
                }
              />

            </div>


            {/* =========================
                SELECT DE ROLES
            ========================= */}


            <div className="campo">

              <label>
                Roles
              </label>

              <select
                multiple
                value={rolesSeleccionados}
                onChange={(e) => {

                  const valoresSeleccionados =
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );

                  setRolesSeleccionados(valoresSeleccionados);

                }}
              >

                {roles.length === 0 ? (

                  <option disabled>
                    No hay roles disponibles
                  </option>

                ) : (

                  roles.map((rol) => (

                    <option
                      key={rol.idRol}
                      value={rol.idRol}
                    >
                      {rol.nombreRol}
                    </option>

                  ))

                )}

              </select>

              <small>
                Mantenga presionada la tecla Ctrl para seleccionar
                varios roles.
              </small>

            </div>


            {/* =========================
                ESTADO
            ========================= */}

            <div className="campo">

              <label>
                Estado
              </label>

              <select
                value={activo ? "true" : "false"}
                onChange={(e) =>
                  setActivo(e.target.value === "true")
                }
              >

                <option value="true">
                  Activo
                </option>

                <option value="false">
                  Inactivo
                </option>

              </select>

            </div>


            {/* =========================
                BOTONES
            ========================= */}

            <div className="formulario-acciones">

              <button
                type="submit"
                className="btn-guardar"
              >
                {usuarioEditando
                  ? "Guardar cambios"
                  : "Crear usuario"
                }
              </button>


              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  setMostrarFormulario(false);
                  setUsuarioEditando(null);
                }}
              >
                Cancelar
              </button>

            </div>

          </form>

        </div>

      )}


      {/* =========================
          TABLA
      ========================= */}

      <table>

        <thead>

          <tr>

            <th>Usuario</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>

          </tr>

        </thead>


        <tbody>

          {usuarios.length === 0 ? (

            <tr>

              <td colSpan="5">
                No hay usuarios registrados.
              </td>

            </tr>

          ) : (

            usuarios.map((usuario) => (

              <tr key={usuario.idUsuario}>

                <td>
                  {usuario.nombreUsuario}
                </td>

                <td>
                  {usuario.nombre} {usuario.apellido}
                </td>

                <td>

                  {usuario.roles &&
                    usuario.roles.length > 0
                    ? usuario.roles
                      .map((rol) => rol.nombreRol)
                      .join(", ")
                    : "Sin rol"
                  }

                </td>

                <td>

                  <span
                    className={
                      usuario.activo
                        ? "activo"
                        : "inactivo"
                    }
                  >
                    {usuario.activo
                      ? "Activo"
                      : "Inactivo"
                    }
                  </span>

                </td>

                <td>

                  <button
                    className="editar"
                    onClick={() =>
                      editarUsuario(usuario)
                    }
                  >
                    Editar
                  </button>

                  <button
                    className="eliminar"
                    onClick={() =>
                      eliminarUsuario(
                        usuario.idUsuario
                      )
                    }
                  >
                    Eliminar
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default Usuarios;

