import "../../pages/administracion/Usuarios.css";


function Usuarios() {


  const usuarios = [

    {
      id: 1,
      usuario: "admin",
      nombre: "Juan Perez",
      rol: "Administrador",
      activo: true
    },

    {
      id: 2,
      usuario: "maria",
      nombre: "Maria Lopez",
      rol: "Empleado",
      activo: true
    }

   ];


  return (

    <div className="usuarios-container">


      <div className="usuarios-header">

        <h2>Usuarios</h2>

        <button>
          + Nuevo usuario
        </button>

      </div>



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

          {
            usuarios.map(u => (

              <tr key={u.id}>

                <td>{u.usuario}</td>

                <td>{u.nombre}</td>

                <td>{u.rol}</td>

                <td>
                  <span className="activo">
                    Activo
                  </span>
                </td>

                <td>

                  <button className="editar">
                    Editar
                  </button>

                  <button className="eliminar">
                    Eliminar
                  </button>

                </td>


              </tr>

            ))
          }


        </tbody>


      </table>


    </div>


  )

}

export default Usuarios;