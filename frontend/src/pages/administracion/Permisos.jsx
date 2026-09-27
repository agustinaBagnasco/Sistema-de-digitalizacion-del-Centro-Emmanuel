import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import "../../styles/global.css";

function Permisos() {

	const [permisos, setPermisos] = useState([]);
	const [mostrarFormulario, setMostrarFormulario] = useState(false);
	const [permisoEditando, setPermisoEditando] = useState(null);

	const [nombrePermiso, setNombrePermiso] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [error, setError] = useState("");

	const cargarPermisos = async () => {
		try {
			const respuesta = await api.get("/permisos");
			setPermisos(respuesta.data);
		} catch (error) {
			console.error("Error al cargar permisos:", error);
			setError("No se pudieron cargar los permisos.");
		}
	};

	useEffect(() => {
		cargarPermisos();
	}, []);

	const limpiarFormulario = () => {
		setNombrePermiso("");
		setDescripcion("");
		setPermisoEditando(null);
		setError("");
	};

	const nuevoPermiso = () => {
		limpiarFormulario();
		setMostrarFormulario(true);
	};

	const editarPermiso = (permiso) => {
		setPermisoEditando(permiso);
		setNombrePermiso(permiso.nombrePermiso || "");
		setDescripcion(permiso.descripcion || "");
		setError("");
		setMostrarFormulario(true);
	};

	const cerrarFormulario = () => {
		setMostrarFormulario(false);
		limpiarFormulario();
	};

	const obtenerUsuarioActual = () => {
		const usuarioGuardado = localStorage.getItem("usuario");
		return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
	};

	const mostrarUsuario = (nombre, id) => {
		const nombreVisible = nombre || "No disponible";
		return id == null ? nombreVisible : `${nombreVisible} (ID: ${id})`;
	};

	const guardarPermiso = async (e) => {
		e.preventDefault();
		setError("");

		if (!nombrePermiso.trim()) {
			setError("Debe ingresar un nombre de permiso.");
			return;
		}

		const usuario = obtenerUsuarioActual();

		if (!usuario?.idUsuario) {
			setError("No se pudo identificar el usuario conectado.");
			return;
		}

		const datosPermiso = {
			nombrePermiso: nombrePermiso.trim(),
			descripcion: descripcion.trim(),
		};

		try {
			if (permisoEditando) {
				await api.put(
					`/permisos/${permisoEditando.idPermiso}?idUsuario=${usuario.idUsuario}`,
					datosPermiso
				);
				alert("Permiso modificado correctamente.");
			} else {
				await api.post(
					`/permisos?idUsuario=${usuario.idUsuario}`,
					datosPermiso
				);
				alert("Permiso creado correctamente.");
			}

			cerrarFormulario();
			await cargarPermisos();
		} catch (error) {
			console.error("Error al guardar permiso:", error);
			setError(error.response?.data?.message || "No se pudo guardar el permiso.");
		}
	};

	const eliminarPermiso = async (id) => {
		if (!window.confirm("¿Está seguro de que desea eliminar este permiso?")) {
			return;
		}

		try {
			await api.delete(`/permisos/${id}`);
			alert("Permiso eliminado correctamente.");
			await cargarPermisos();
		} catch (error) {
			console.error("Error al eliminar permiso:", error);
			setError("No se pudo eliminar el permiso.");
		}
	};

	return (
		<div className="pagina">
			<Card title="· PERMISOS ·">
				<Button
					className={`btn btn-${"primary"}`}
					onClick={nuevoPermiso}
				>
					+ Nuevo permiso
				</Button>

				{error && (
					<div className="mensaje-error">
						{error}
						<Button
							type="button"
							variant="secondary"
							onClick={() => setError("")}
						>
							×
						</Button>
					</div>
				)}

				{mostrarFormulario && (
					<div className="formulario-usuario">
						<h3>{permisoEditando ? "Modificar permiso" : "Nuevo permiso"}</h3>
						<br />

						<form onSubmit={guardarPermiso} className="form-field columns-2">
							<div className="input-group">
								<label>Nombre del permiso</label>
								<Input
									type="text"
									value={nombrePermiso}
									onChange={(e) => setNombrePermiso(e.target.value)}
									placeholder="Ej. ADMINISTRAR_PRODUCTOS"
								/>
							</div>

							<div className="input-group">
								<label>Descripción</label>
								<Textarea
									value={descripcion}
									onChange={(e) => setDescripcion(e.target.value)}
									placeholder="Descripción del permiso"
									rows="3"
								/>
							</div>

							<div className="table-actions">
								<Button type="submit" className={`btn btn-${"primary"}`}>
									{permisoEditando ? "Guardar cambios" : "Crear permiso"}
								</Button>
								<Button type="button" variant="secondary" onClick={cerrarFormulario}>
									Cancelar
								</Button>
							</div>
						</form>
					</div>
				)}

				<br />

				<div className="table-container">
					<table className="table">
						<thead style={{ backgroundColor: "#f2f2f2" }}>
							<tr>
								<th>ID</th>
								<th>Permiso</th>
								<th>Descripción</th>
								<th>Creado por</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{permisos.length === 0 ? (
								<tr>
									<td colSpan="5">No hay permisos registrados.</td>
								</tr>
							) : (
								permisos.map((permiso) => (
									<tr key={permiso.idPermiso}>
										<td>{permiso.idPermiso}</td>
										<td>{permiso.nombrePermiso}</td>
										<td>{permiso.descripcion || "-"}</td>
										<td>{mostrarUsuario(permiso.nombreUsuarioCreacion, permiso.idUsuarioCreacion)}</td>
										<td>
											<div className="table-actions">
												<Button variant="secondary" onClick={() => editarPermiso(permiso)}>
													Editar
												</Button>
												<Button variant="danger" onClick={() => eliminarPermiso(permiso.idPermiso)}>
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

export default Permisos;
