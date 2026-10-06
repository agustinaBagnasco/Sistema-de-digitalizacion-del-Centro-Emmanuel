import { Fragment, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Download } from "lucide-react";
import * as XLSX from "xlsx";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import "./ManoDeObra.css";

const nombresCategorias = {
  DULCEDELECHE: "Dulce de leche",
  MERMELADA: "Mermeladas",
  MOLIENDA: "Molienda",
  GRANOS: "Molienda",
  QUESO: "Quesos",
  QUARK: "Quark",
};

const formatoHoras = new Intl.NumberFormat("es-UY", {
  maximumFractionDigits: 2,
});

function obtenerNombreUsuario(usuario) {
  const nombreCompleto = [usuario.nombre, usuario.apellido]
    .filter((parte) => parte?.trim())
    .join(" ");

  return nombreCompleto || usuario.nombreUsuario || `Usuario ${usuario.idUsuario}`;
}

function obtenerCategoriaElaboracion(elaboracion) {
  const producto = elaboracion.productoElaborado;
  const categoria = producto?.categoria?.toUpperCase();

  if (elaboracion.detalles?.some((detalle) => detalle.insumoUtilizado?.categoria === "GRANOS")) {
    return "Molienda";
  }

  return nombresCategorias[categoria] || producto?.nombreProducto || "Elaboración";
}

function agruparHoras(usuarios, elaboraciones) {
  const grupos = new Map();

  usuarios.forEach((usuario) => {
    grupos.set(String(usuario.idUsuario), {
      id: String(usuario.idUsuario),
      nombre: obtenerNombreUsuario(usuario),
      nombreUsuario: usuario.nombreUsuario || "",
      minutosTotales: 0,
      minutosPorCategoria: new Map(),
    });
  });

  elaboraciones.forEach((elaboracion) => {
    const usuario = elaboracion.usuario;
    if (!usuario?.idUsuario) return;

    const id = String(usuario.idUsuario);
    const grupo = grupos.get(id) || {
      id,
      nombre: obtenerNombreUsuario(usuario),
      nombreUsuario: usuario.nombreUsuario || "",
      minutosTotales: 0,
      minutosPorCategoria: new Map(),
    };
    const minutos = Number(elaboracion.tiempoElaboracion);
    if (!Number.isFinite(minutos) || minutos <= 0) {
      grupos.set(id, grupo);
      return;
    }

    const categoria = obtenerCategoriaElaboracion(elaboracion);
    grupo.minutosTotales += minutos;
    grupo.minutosPorCategoria.set(
      categoria,
      (grupo.minutosPorCategoria.get(categoria) || 0) + minutos
    );
    grupos.set(id, grupo);
  });

  return Array.from(grupos.values())
    .map((grupo) => ({
      ...grupo,
      categorias: Array.from(grupo.minutosPorCategoria, ([nombre, minutos]) => ({
        nombre,
        minutos,
      })).sort((a, b) => b.minutos - a.minutos),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

function ManoDeObra() {
  const [usuarios, setUsuarios] = useState([]);
  const [elaboraciones, setElaboraciones] = useState([]);
  const [usuarioExpandido, setUsuarioExpandido] = useState(null);
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      try {
        const [respuestaUsuarios, respuestaElaboraciones] = await Promise.all([
          api.get("/usuarios"),
          api.get("/elaboraciones"),
        ]);

        if (activo) {
          setUsuarios(Array.isArray(respuestaUsuarios.data) ? respuestaUsuarios.data : []);
          setElaboraciones(Array.isArray(respuestaElaboraciones.data) ? respuestaElaboraciones.data : []);
          setError("");
        }
      } catch (errorCarga) {
        console.error("Error al cargar el resumen de mano de obra:", errorCarga);
        if (activo) setError("No se pudo cargar el resumen de horas trabajadas.");
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargarDatos();
    return () => {
      activo = false;
    };
  }, []);

  const grupos = agruparHoras(usuarios, elaboraciones);
  const consultaUsuario = busquedaUsuario.trim().toLocaleLowerCase("es");
  const gruposFiltrados = grupos.filter((grupo) =>
    [grupo.nombre, grupo.nombreUsuario]
      .some((valor) => String(valor || "").toLocaleLowerCase("es").includes(consultaUsuario))
  );

  function exportarExcel() {
    const resumen = gruposFiltrados.map((grupo) => ({
      Usuario: grupo.nombre,
      Cuenta: grupo.nombreUsuario,
      "Horas trabajadas": grupo.minutosTotales / 60,
    }));
    const detalle = gruposFiltrados.flatMap((grupo) => (
      grupo.categorias.length
        ? grupo.categorias.map((categoria) => ({
          Usuario: grupo.nombre,
          Elaboración: categoria.nombre,
          "Horas trabajadas": categoria.minutos / 60,
        }))
        : [{ Usuario: grupo.nombre, Elaboración: "Sin elaboraciones", "Horas trabajadas": 0 }]
    ));
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, XLSX.utils.json_to_sheet(resumen), "Resumen");
    XLSX.utils.book_append_sheet(libro, XLSX.utils.json_to_sheet(detalle), "Desglose");
    XLSX.writeFile(libro, "mano-de-obra.xlsx");
  }

  return (
    <div className="pagina">
      <Card title="· MANO DE OBRA ·">
        <div className="mano-obra-toolbar">
          <p>Horas trabajadas por usuario</p>
          <Button
            type="button"
            variant="secondary"
            onClick={exportarExcel}
            disabled={cargando || Boolean(error) || gruposFiltrados.length === 0}
          >
            <Download size={16} aria-hidden="true" />
            Exportar Excel
          </Button>
        </div>

        {error && <p className="mano-obra-message" role="alert">{error}</p>}

        {cargando ? (
          <p className="mano-obra-message" role="status">Cargando horas trabajadas...</p>
        ) : !error && grupos.length === 0 ? (
          <p className="mano-obra-message">No hay usuarios registrados.</p>
        ) : !error ? (
          <>
          <div className="mano-obra-search">
            <label htmlFor="buscar-usuario-mano-obra">Buscar usuario</label>
            <input
              id="buscar-usuario-mano-obra"
              className="input"
              type="search"
              value={busquedaUsuario}
              onChange={(evento) => setBusquedaUsuario(evento.target.value)}
              placeholder="Nombre o cuenta del usuario"
            />
          </div>
          {gruposFiltrados.length === 0 ? (
            <p className="mano-obra-message">No hay usuarios que coincidan con la búsqueda.</p>
          ) : (
          <div className="table-container mano-obra-table-container">
            <table className="table mano-obra-table">
              <thead>
                <tr>
                  <th scope="col">Usuario</th>
                  <th scope="col">Total de horas</th>
                  <th scope="col">Desglose</th>
                </tr>
              </thead>
              <tbody>
                {gruposFiltrados.map((grupo) => {
                  const expandido = usuarioExpandido === grupo.id;
                  const idDesglose = `desglose-${grupo.id}`;

                  return (
                    <Fragment key={grupo.id}>
                      <tr>
                        <td>
                          <button
                            type="button"
                            className="mano-obra-toggle"
                            aria-expanded={expandido}
                            aria-controls={idDesglose}
                            onClick={() => setUsuarioExpandido(expandido ? null : grupo.id)}
                          >
                            {expandido
                              ? <ChevronDown size={17} aria-hidden="true" />
                              : <ChevronRight size={17} aria-hidden="true" />}
                            <span>{grupo.nombre}</span>
                          </button>
                        </td>
                        <td className="mano-obra-total">
                          {formatoHoras.format(grupo.minutosTotales / 60)} h
                        </td>
                        <td>
                          <button
                            type="button"
                            className="mano-obra-detail-link"
                            aria-expanded={expandido}
                            aria-controls={idDesglose}
                            onClick={() => setUsuarioExpandido(expandido ? null : grupo.id)}
                          >
                            {expandido ? "Ocultar" : "Ver detalle"}
                          </button>
                        </td>
                      </tr>
                      {expandido && (
                        <tr id={idDesglose} className="mano-obra-detail-row">
                          <td colSpan="3">
                            {grupo.categorias.length > 0 ? (
                              <ul className="mano-obra-breakdown">
                                {grupo.categorias.map((categoria) => (
                                  <li key={categoria.nombre}>
                                    <span>{categoria.nombre}</span>
                                    <strong>{formatoHoras.format(categoria.minutos / 60)} h</strong>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mano-obra-empty-detail">Este usuario aún no tiene horas registradas.</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
          </>
        ) : null}
      </Card>
    </div>
  );
}

export default ManoDeObra;