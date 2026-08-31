import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

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


  // ========================= CARGAR USUARIOS =========================

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

  // const cargarRoles = async () => {

  //   try {

  //     const respuesta = await api.get("/roles");

  //     setRoles(respuesta.data);

  //   } catch (error) {

  //     console.error("Error al cargar roles:", error);

  //   }

  // };


  useEffect(() => {

    cargarUsuarios();
    //cargarRoles();

  }, []);


  // ========================= NUEVO USUARIO =========================

  const nuevoUsuario = () => {

    setUsuarioEditando(null);

    setNombreUsuario("");
    setNombre("");
    setApellido("");
    setClave("");
    setEmail("");
    setActivo(true);
    //setRolesSeleccionados([]);

    setMostrarFormulario(true);

  };


  // ========================= EDITAR USUARIO =========================

  const editarUsuario = (usuario) => {

    setUsuarioEditando(usuario);

    setNombreUsuario(usuario.nombreUsuario || "");
    setNombre(usuario.nombre || "");
    setApellido(usuario.apellido || "");
    setClave("");
    setEmail(usuario.email || "");
    setActivo(usuario.activo);

    // if (usuario.roles && usuario.roles.length > 0) {

    //   setRolesSeleccionados(
    //     usuario.roles.map((rol) =>
    //       String(rol.idRol)
    //     )
    //   );

    // } else {

    //   setRolesSeleccionados([]);

    // }
    setMostrarFormulario(true);

  };


  // ========================= GUARDAR USUARIO =========================

  const guardarUsuario = async (e) => {

    e.preventDefault();


    if (!nombreUsuario.trim()) {

      alert("Debe ingresar un nombre de usuario.");

      return;

    }


    // if (rolesSeleccionados.length === 0) {

    //   alert("Debe seleccionar al menos un rol.");

    //   return;

    // }


    const datosUsuario = {

      nombreUsuario: nombreUsuario.trim(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      clave: clave,
      email: email.trim(),
      activo: activo,

      // roles: rolesSeleccionados.map((id) => ({
      //   idRol: Number(id)
      // }))

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


  // ========================= ELIMINAR USUARIO =========================

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

    <div className="pagina">


      {/* ========================= ENCABEZADO ========================= */}

     
        <Card title="· USUARIOS ·">


          <div className="usuarios-header-buttons">
            <Button
              className={`btn btn-${"primary"}`}
              onClick={nuevoUsuario}
            >
              + Nuevo usuario
            </Button>

          </div>
          <br></br>
          {/* ========================= FORMULARIO ========================= */}

          {mostrarFormulario && (

            <form className="form-field columns-1">

              <h3>
                {usuarioEditando
                  ? "Modificar usuario"
                  : "Nuevo usuario"
                }
              </h3>


              <form onSubmit={guardarUsuario}>
                <div className="input-group">
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

                <div className="input-group">
                  <label>Nombre</label>

                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) =>
                      setNombre(e.target.value)
                    }
                    placeholder="Nombre"
                  />

                </div>
                <div className="input-group">
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
                <div className="input-group">
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
                <div className="input-group">

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
                {/* 

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

                </div> */}


                {/* ========================= ESTADO ========================= */}
                <div className="input-group">

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

<br></br>
                {/* ========================= BOTONES ========================= */}

                <div className="table-actions">

                  <Button
                    className={`btn btn-${"primary"}`}
                    type="submit"

                  >
                    {usuarioEditando
                      ? "Guardar cambios"
                      : "Crear usuario"
                    }
                  </Button>


                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setMostrarFormulario(false);
                      setUsuarioEditando(null);
                    }}
                  >
                    Cancelar
                  </Button>

                </div>

              </form>

            </form>

          )}


          {/* ========================= TABLA ========================= */}

          <div className="table-container">
            <table className="table">

              <thead>

                <tr>

                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Permisos</th>
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
                        <div className="table-actions">
                          <Button
                            variant="secondary"
                            onClick={() =>
                              editarUsuario(usuario)
                            }
                          >
                            Editar
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() =>
                              eliminarUsuario(
                                usuario.idUsuario
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

export default Usuarios;

