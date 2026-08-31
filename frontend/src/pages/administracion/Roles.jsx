// import { useEffect, useState } from "react";
// import api from "../../services/api";
// //import "./Roles.css";

// function Roles() {

//     const [roles, setRoles] = useState([]);
//     const [permisos, setPermisos] = useState([]);

//     const [mostrarFormulario, setMostrarFormulario] = useState(false);

//     const [rolEditando, setRolEditando] = useState(null);

//     const [formulario, setFormulario] = useState({
//         nombreRol: "",
//         descripcion: "",
//         permisos: []
//     });


//     // =========================
//     // CARGAR DATOS
//     // =========================

//     useEffect(() => {

//         cargarRoles();
//         cargarPermisos();

//     }, []);


//     const cargarRoles = async () => {

//         try {

//             const response = await api.get("/roles");

//             setRoles(response.data);

//         } catch (error) {

//             console.error(
//                 "Error al cargar roles:",
//                 error
//             );

//         }

//     };


//     const cargarPermisos = async () => {

//         try {

//             const response = await api.get("/permisos");

//             setPermisos(response.data);

//         } catch (error) {

//             console.error(
//                 "Error al cargar permisos:",
//                 error
//             );

//         }

//     };


//     // =========================
//     // CAMBIAR CAMPOS
//     // =========================

//     const cambiarCampo = (e) => {

//         const { name, value } = e.target;

//         setFormulario(prev => ({
//             ...prev,
//             [name]: value
//         }));

//     };


//     // =========================
//     // SELECCIONAR PERMISO
//     // =========================

//     const cambiarPermiso = (idPermiso) => {

//         setFormulario(prev => {

//             const seleccionado =
//                 prev.permisos.includes(idPermiso);


//             if (seleccionado) {

//                 return {
//                     ...prev,

//                     permisos: prev.permisos.filter(
//                         id => id !== idPermiso
//                     )
//                 };

//             }


//             return {
//                 ...prev,

//                 permisos: [
//                     ...prev.permisos,
//                     idPermiso
//                 ]
//             };

//         });

//     };


//     // =========================
//     // NUEVO ROL
//     // =========================

//     const nuevoRol = () => {

//         setRolEditando(null);

//         setFormulario({
//             nombreRol: "",
//             descripcion: "",
//             permisos: []
//         });

//         setMostrarFormulario(true);

//     };


//     // =========================
//     // EDITAR ROL
//     // =========================

//     const editarRol = (rol) => {

//         setRolEditando(rol.idRol);

//         setFormulario({
//             nombreRol: rol.nombreRol,
//             descripcion: rol.descripcion,

//             permisos: rol.permisos
//                 ? rol.permisos.map(
//                     permiso => permiso.idPermiso
//                 )
//                 : []
//         });

//         setMostrarFormulario(true);

//     };


//     // =========================
//     // GUARDAR
//     // =========================

//     const guardarRol = async (e) => {

//         e.preventDefault();


//         try {

//             const datos = {

//                 nombreRol:
//                     formulario.nombreRol,

//                 descripcion:
//                     formulario.descripcion,

//                 permisos:
//                     formulario.permisos.map(id => ({
//                         idPermiso: id
//                     }))
//             };


//             if (rolEditando) {

//                 await api.put(
//                     `/roles/${rolEditando}`,
//                     datos
//                 );

//             } else {

//                 await api.post(
//                     "/roles",
//                     datos
//                 );

//             }


//             await cargarRoles();

//             setMostrarFormulario(false);

//             setRolEditando(null);

//             setFormulario({
//                 nombreRol: "",
//                 descripcion: "",
//                 permisos: []
//             });


//         } catch (error) {

//             console.error(
//                 "Error al guardar rol:",
//                 error
//             );

//         }

//     };


//     // =========================
//     // ELIMINAR
//     // =========================

//     const eliminarRol = async (id) => {

//         const confirmar =
//             window.confirm(
//                 "¿Está seguro que desea eliminar este rol?"
//             );


//         if (!confirmar) {
//             return;
//         }


//         try {

//             await api.delete(
//                 `/roles/${id}`
//             );

//             await cargarRoles();

//         } catch (error) {

//             console.error(
//                 "Error al eliminar rol:",
//                 error
//             );

//         }

//     };


//     return (

//         <div className="roles-container">


//             {/* HEADER */}

//             <div className="roles-header">

//                 <h2>Roles</h2>

//                 <button
//                     onClick={nuevoRol}
//                 >
//                     + Nuevo rol
//                 </button>

//             </div>


//             {/* TABLA */}

//             <table>

//                 <thead>

//                     <tr>

//                         <th>Nombre</th>

//                         <th>Descripción</th>

//                         <th>Permisos</th>

//                         <th>Acciones</th>

//                     </tr>

//                 </thead>


//                 <tbody>

//                     {roles.map(rol => (

//                         <tr key={rol.idRol}>

//                             <td>
//                                 {rol.nombreRol}
//                             </td>

//                             <td>
//                                 {rol.descripcion}
//                             </td>

//                             <td>

//                                 {rol.permisos?.map(
//                                     permiso => (

//                                         <span
//                                             key={
//                                                 permiso.idPermiso
//                                             }
//                                             className="permiso-tag"
//                                         >
//                                             {
//                                                 permiso.nombrePermiso
//                                             }
//                                         </span>

//                                     )
//                                 )}

//                             </td>


//                             <td>

//                                 <button
//                                     className="editar"
//                                     onClick={() =>
//                                         editarRol(rol)
//                                     }
//                                 >
//                                     Editar
//                                 </button>


//                                 <button
//                                     className="eliminar"
//                                     onClick={() =>
//                                         eliminarRol(
//                                             rol.idRol
//                                         )
//                                     }
//                                 >
//                                     Eliminar
//                                 </button>

//                             </td>

//                         </tr>

//                     ))}

//                 </tbody>

//             </table>


//             {/* FORMULARIO */}

//             {mostrarFormulario && (

//                 <div className="modal">

//                     <div className="modal-content">


//                         <h3>

//                             {rolEditando
//                                 ? "Modificar rol"
//                                 : "Nuevo rol"}

//                         </h3>


//                         <form
//                             onSubmit={guardarRol}
//                         >


//                             {/* NOMBRE */}

//                             <label>
//                                 Nombre del rol
//                             </label>

//                             <input
//                                 type="text"
//                                 name="nombreRol"
//                                 value={
//                                     formulario.nombreRol
//                                 }
//                                 onChange={
//                                     cambiarCampo
//                                 }
//                                 required
//                             />


//                             {/* DESCRIPCIÓN */}

//                             <label>
//                                 Descripción
//                             </label>

//                             <textarea
//                                 name="descripcion"
//                                 value={
//                                     formulario.descripcion
//                                 }
//                                 onChange={
//                                     cambiarCampo
//                                 }
//                             />


//                             {/* PERMISOS */}

//                             <h4>
//                                 Permisos
//                             </h4>


//                             <div className="permisos-lista">

//                                 {permisos.map(
//                                     permiso => (

//                                         <label
//                                             key={
//                                                 permiso.idPermiso
//                                             }
//                                             className="permiso-item"
//                                         >

//                                             <input
//                                                 type="checkbox"

//                                                 checked={
//                                                     formulario.permisos.includes(
//                                                         permiso.idPermiso
//                                                     )
//                                                 }

//                                                 onChange={() =>
//                                                     cambiarPermiso(
//                                                         permiso.idPermiso
//                                                     )
//                                                 }
//                                             />


//                                             <div>

//                                                 <strong>
//                                                     {
//                                                         permiso.nombrePermiso
//                                                     }
//                                                 </strong>

//                                                 <small>
//                                                     {
//                                                         permiso.descripcion
//                                                     }
//                                                 </small>

//                                             </div>

//                                         </label>

//                                     )
//                                 )}

//                             </div>


//                             {/* BOTONES */}

//                             <div className="form-buttons">

//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         setMostrarFormulario(
//                                             false
//                                         )
//                                     }
//                                 >
//                                     Cancelar
//                                 </button>


//                                 <button
//                                     type="submit"
//                                 >
//                                     Guardar
//                                 </button>

//                             </div>


//                         </form>

//                     </div>

//                 </div>

//             )}

//         </div>

//     );

// }

// export default Roles;