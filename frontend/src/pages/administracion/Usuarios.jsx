import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { sortActiveLast } from "../../utils/sortActiveLast";

function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [busquedaUsuario, setBusquedaUsuario] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [clave, setClave] = useState("");
  const [email, setEmail] = useState("");
  const [activo, setActivo] = useState(true);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);


  // ========================= CARGAR USUARIOS =========================

  const cargarUsuarios = async () => {

    try {

      const respuesta = await api.get("/usuarios");

      setUsuarios(respuesta.data);

    } catch (error) {

      console.error("Error al cargar usuarios:", error);

    }

  };

  const cargarPermisos = async () => {
    try {
      const respuesta = await api.get("/permisos");
      setPermisos(respuesta.data);
    } catch (error) {
      console.error("Error al cargar permisos:", error);
    }
  };

  useEffect(() => {

    cargarUsuarios();
    cargarPermisos();

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
    setPermisosSeleccionados([]);

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
    setPermisosSeleccionados((usuario.permisos || []).map((permiso) => String(permiso.idPermiso)));
    setMostrarFormulario(true);

  };

  // ========================= GUARDAR USUARIO =========================

  const guardarUsuario = async (e) => {

    e.preventDefault();

    if (!nombreUsuario.trim()) {

      alert("Debe ingresar un nombre de usuario.");

      return;

    }

    const datosUsuario = {

      nombreUsuario: nombreUsuario.trim(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      activo: activo,
    };

    if (!usuarioEditando || clave.trim()) {
      datosUsuario.clave = clave;
    }

    if (usuarioEditando) {
      datosUsuario.permisos = permisosSeleccionados.map((id) => ({
        idPermiso: Number(id),
      }));
    }


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

  const consultaUsuario = busquedaUsuario.trim().toLocaleLowerCase("es");
  const usuariosFiltrados = sortActiveLast(usuarios.filter((usuario) =>
    [
      usuario.nombreUsuario,
      usuario.nombre,
      usuario.apellido,
    ].some((valor) => String(valor || "").toLocaleLowerCase("es").includes(consultaUsuario))
  ));

  return (

    <div className="pagina">
      <Card title="· USUARIOS ·">
        <div className="usuarios-header-buttons">
          <Button
            className={`btn btn-${"primary"}`}
            onClick={nuevoUsuario}
          >
            + Nuevo usuario
          </Button>

        </div>
        <br />
        {/* ========================= FORMULARIO ========================= */}

        {mostrarFormulario && (
          <div className="formulario-usuario">
            <h3>
              {usuarioEditando
                ? "Modificar usuario"
                : "Nuevo usuario"
              }
            </h3>
            <br />

            <form onSubmit={guardarUsuario} className="form-field columns-2">
              <div className="input-group">
                <label>Usuario</label>
                <Input
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

                <Input
                  type="text"
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  }
                  placeholder="Nombre"
                />

              </div>
              <div className="input-group">
                <label>Apellido</label>

                <Input
                  type="text"
                  value={apellido}
                  onChange={(e) =>
                    setApellido(e.target.value)
                  }
                  placeholder="Apellido"
                />

              </div>
              <div className="input-group">
                <label>Email</label>

                <Input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="correo@email.com"
                />

              </div>
              <div className="input-group">
                <label>Clave</label>

                <Input
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

              {usuarioEditando && (
                <div className="input-group">
                  <label htmlFor="usuario-activo">Estado del usuario</label>
                  <label
                    className="usuario-estado-control"
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      id="usuario-activo"
                      type="checkbox"
                      checked={activo}
                      onChange={(evento) => setActivo(evento.target.checked)}
                      style={{ width: "auto", margin: 0 }}
                    />
                    <span>{activo ? "Activo: puede iniciar sesión" : "Inactivo: acceso bloqueado"}</span>
                  </label>
                </div>
              )}

              {usuarioEditando && (
                <div className="input-group">
                  <fieldset
                    className="input-group"
                    style={{
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-sm)",
                      boxSizing: "border-box",
                      gap: "8px",
                      maxHeight: "240px",
                      overflowY: "auto",
                      padding: "12px",
                    }}
                  >
                    <legend>Permisos</legend>
                    {permisos.length === 0 ? (
                      <span>No hay permisos disponibles.</span>
                    ) : (
                      permisos.map((permiso) => {
                        const permisoId = String(permiso.idPermiso);
                        return (
                          <label
                            key={permiso.idPermiso}
                            style={{ alignItems: "center", display: "flex", gap: "8px" }}
                          >
                            <input
                              type="checkbox"
                              checked={permisosSeleccionados.includes(permisoId)}
                              onChange={() =>
                                setPermisosSeleccionados((seleccionados) =>
                                  seleccionados.includes(permisoId)
                                    ? seleccionados.filter((id) => id !== permisoId)
                                    : [...seleccionados, permisoId]
                                )
                              }
                            />
                            <span>{permiso.idPermiso} - {permiso.nombrePermiso}</span>
                          </label>
                        );
                      })
                    )}
                  </fieldset>
                </div>
              )}

              <br />
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
          </div>
        )}
        <br />

        {/* ========================= TABLA ========================= */}
        <div className="input-group" style={{ maxWidth: "420px", marginBottom: "16px" }}>
          <label htmlFor="buscar-usuario">Buscar usuario</label>
          <Input
            id="buscar-usuario"
            type="search"
            value={busquedaUsuario}
            onChange={(evento) => setBusquedaUsuario(evento.target.value)}
            placeholder="Nombre, apellido o cuenta"
          />
        </div>
        <div className="table-container">
          <table className="table">
            <thead style={{ backgroundColor: "#f2f2f2" }}>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Permisos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (

                <tr>
                  <td colSpan="5">
                    {usuarios.length === 0
                      ? "No hay usuarios registrados."
                      : "No hay usuarios que coincidan con la búsqueda."}
                  </td>
                </tr>

              ) : (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.idUsuario}>
                    <td>
                      {usuario.nombreUsuario}
                    </td>
                    <td>
                      {usuario.nombre} {usuario.apellido}
                    </td>

                    <td>
                      {usuario.permisos &&
                        usuario.permisos.length > 0
                        ? usuario.permisos
                          .map((permiso) => `${permiso.idPermiso} - ${permiso.nombrePermiso}`)
                          .join(", ")
                        : "Sin Permisos"
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
