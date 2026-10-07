import { useEffect, useState } from "react";
import { Download, FileBarChart2, Search } from "lucide-react";
import * as XLSX from "xlsx";
import Card from "../../components/ui/Card";
import api from "../../services/api";
import "./Reportes.css";

const tiposReporte = [
  { valor: "PRODUCCION", etiqueta: "Producción" },
  { valor: "STOCK", etiqueta: "Stock" },
  { valor: "VENTAS", etiqueta: "Ventas" },
  { valor: "INSUMOS", etiqueta: "Insumos utilizados" },
];

const formatoNumero = new Intl.NumberFormat("es-UY", { maximumFractionDigits: 3 });

function Reportes() {
  const [pestanaActiva, setPestanaActiva] = useState("reportes");
  const [tipo, setTipo] = useState("PRODUCCION");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [busquedaResponsable, setBusquedaResponsable] = useState("");
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [lecheAbierta, setLecheAbierta] = useState(false);
  const [reportesMensuales, setReportesMensuales] = useState([]);
  const [cargandoMensuales, setCargandoMensuales] = useState(true);
  const [errorMensuales, setErrorMensuales] = useState("");

  useEffect(() => {
    let vigente = true;
    api.get("/reportes/mensuales")
      .then((respuesta) => {
        if (vigente) setReportesMensuales(respuesta.data);
      })
      .catch(() => {
        if (vigente) setErrorMensuales("No se pudieron cargar los reportes mensuales.");
      })
      .finally(() => {
        if (vigente) setCargandoMensuales(false);
      });
    return () => {
      vigente = false;
    };
  }, []);

  const busquedaProductoNormalizada = busquedaProducto.trim().toLocaleLowerCase("es");
  const busquedaResponsableNormalizada = busquedaResponsable.trim().toLocaleLowerCase("es");
  const reporteFiltrado = reporte ? (() => {
    if (reporte.tipo === "PRODUCCION") {
      const filas = reporte.filas.filter((fila) => (
        String(fila["Producto/Concepto"] || "").toLocaleLowerCase("es")
          .includes(busquedaProductoNormalizada)
        && String(fila.Responsable || fila.Usuario || "").toLocaleLowerCase("es")
          .includes(busquedaResponsableNormalizada)
      ));
      return {
        ...reporte,
        filas,
        totales: { ...reporte.totales, Registros: filas.length },
      };
    }
    if (reporte.tipo === "VENTAS") {
      const filas = reporte.filas.filter((fila) =>
        String(fila.Producto || "").toLocaleLowerCase("es").includes(busquedaProductoNormalizada)
      );
      const filasDetalle = (reporte.filasDetalle || []).filter((fila) =>
        String(fila.Producto || "").toLocaleLowerCase("es").includes(busquedaProductoNormalizada)
      );
      return {
        ...reporte,
        filas,
        filasDetalle,
        totales: {
          "Cantidad vendida": filas.reduce((total, fila) => total + Number(fila["Cantidad vendida"] || 0), 0),
          "Total vendido": filas.reduce((total, fila) => total + Number(fila["Ingresos totales"] || 0), 0),
          "Productos vendidos": filas.length,
        },
      };
    }
    return reporte;
  })() : null;

  async function generarReporte(evento) {
    evento.preventDefault();
    setError("");
    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
      setError("La fecha desde no puede ser posterior a la fecha hasta.");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await api.post("/reportes", {
        tipo,
        fechaDesde: fechaDesde || null,
        fechaHasta: fechaHasta || null,
      });
      setReporte(respuesta.data);
    } catch (errorCarga) {
      const respuesta = errorCarga.response;
      const detalle = respuesta?.data?.mensaje
        || respuesta?.data?.message
        || respuesta?.data?.error;
      if (respuesta?.status === 404) {
        setError("El backend en ejecución no reconoce /api/reportes. Reinicie el backend para cargar el ReporteController.");
      } else if (respuesta) {
        setError(detalle
          ? `No se pudo generar el reporte (HTTP ${respuesta.status}): ${detalle}`
          : `No se pudo generar el reporte. El servidor respondió HTTP ${respuesta.status}.`);
      } else {
        setError("No se pudo conectar con el backend. Verifique que esté iniciado en http://localhost:8080.");
      }
      setReporte(null);
    } finally {
      setCargando(false);
    }
  }

  function exportarExcel() {
    if (!reporteFiltrado) return;
    if (reporteFiltrado.tipo === "VENTAS" && reporteFiltrado.filas.length > 0
      && (!Array.isArray(reporteFiltrado.filasDetalle) || reporteFiltrado.filasDetalle.length === 0)) {
      setError("El backend aún no envía el detalle de cada venta. Reinícielo antes de exportar este reporte.");
      return;
    }

    setError("");
    const libro = XLSX.utils.book_new();
    const filasTabla = reporteFiltrado.tipo === "VENTAS"
      ? crearFilasExcelVentas(reporteFiltrado)
      : [
        reporteFiltrado.columnas,
        ...reporteFiltrado.filas.map((fila) => reporteFiltrado.columnas.map((columna) => mostrarValor(fila[columna]))),
      ];
    const hojaReporte = XLSX.utils.aoa_to_sheet(filasTabla);
    if (reporteFiltrado.tipo !== "VENTAS") {
      hojaReporte["!autofilter"] = {
        ref: XLSX.utils.encode_range({
          s: { r: 0, c: 0 },
          e: { r: Math.max(filasTabla.length - 1, 0), c: Math.max(reporteFiltrado.columnas.length - 1, 0) },
        }),
      };
    }
    XLSX.utils.book_append_sheet(libro, hojaReporte, "Reporte");
    XLSX.writeFile(libro, `reporte-${reporteFiltrado.tipo.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  function crearFilasExcelVentas(datosReporte) {
    const columnas = ["Fecha", "Venta", "Producto", "Unidad", "Cantidad", "Precio unitario", "Subtotal", "Usuario"];
    const filas = [columnas];
    const ventasPorProducto = new Map();

    datosReporte.filasDetalle.forEach((venta) => {
      const claveGrupo = `${venta.Producto}\u0000${venta.Unidad || ""}`;
      const grupo = ventasPorProducto.get(claveGrupo) || [];
      grupo.push(venta);
      ventasPorProducto.set(claveGrupo, grupo);
    });

    [...ventasPorProducto.entries()]
      .sort(([, ventasA], [, ventasB]) => ventasA[0].Producto.localeCompare(ventasB[0].Producto, "es"))
      .forEach(([, ventas]) => {
        const { Producto: producto, Unidad: unidad } = ventas[0];
        filas.push(["", "", `Producto: ${producto}`, unidad || "", "", "", "", ""]);
        let cantidadTotal = 0;
        let ingresosTotales = 0;
        ventas.forEach((venta) => {
          const cantidad = Number(venta.Cantidad) || 0;
          const subtotal = Number(venta.Subtotal) || 0;
          cantidadTotal += cantidad;
          ingresosTotales += subtotal;
          filas.push(columnas.map((columna) => mostrarValor(venta[columna])));
        });
        filas.push([
          "",
          "",
          `Total ${producto}`,
          unidad || "",
          formatoNumero.format(cantidadTotal),
          "",
          formatoNumero.format(ingresosTotales),
          "",
        ]);
        filas.push(["", "", "", "", "", "", "", ""]);
      });

    filas.push(["", "", "Total general", "", formatoNumero.format(Number(datosReporte.totales?.["Cantidad vendida"]) || 0),
      "", formatoNumero.format(Number(datosReporte.totales?.["Total vendido"]) || 0), ""]);
    return filas;
  }

  async function descargarReporteMensual(periodo) {
    try {
      const respuesta = await api.get(`/reportes/mensuales/${periodo}/descarga`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(respuesta.data);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `reporte-general-${periodo}.xlsx`;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setErrorMensuales(`No se pudo descargar el reporte mensual ${periodo}.`);
    }
  }

  function mostrarValor(valor) {
    if (valor == null || valor === "") return "—";
    if (typeof valor === "number") return formatoNumero.format(valor);
    if (typeof valor === "object") return JSON.stringify(valor);
    return String(valor);
  }

  return (
    <div className="pagina reportes">
      <Card title="· REPORTES ·">
        <p className="reportes__introduccion">
          Generá reportes de producción, existencias, ventas o insumos utilizados y descargalos en Excel.
        </p>
        <div className="reportes__tabs" role="tablist" aria-label="Sección de reportes">
          <button
            id="tab-reportes"
            className={`reportes__tab${pestanaActiva === "reportes" ? " reportes__tab--activo" : ""}`}
            type="button"
            role="tab"
            aria-selected={pestanaActiva === "reportes"}
            aria-controls="panel-reportes"
            onClick={() => setPestanaActiva("reportes")}
          >
            Reportes
          </button>
          <button
            id="tab-reportes-mensuales"
            className={`reportes__tab${pestanaActiva === "mensuales" ? " reportes__tab--activo" : ""}`}
            type="button"
            role="tab"
            aria-selected={pestanaActiva === "mensuales"}
            aria-controls="panel-reportes-mensuales"
            onClick={() => setPestanaActiva("mensuales")}
          >
            Reportes mensuales
          </button>
        </div>

        {pestanaActiva === "reportes" && (
          <section id="panel-reportes" role="tabpanel" aria-labelledby="tab-reportes">
            {tipo === "VENTAS" && (
              <p className="reportes__nota">
                Las ventas del período se agrupan por producto e incluyen la cantidad total y los ingresos acumulados.
              </p>
            )}

            <form className="reportes__filtros" onSubmit={generarReporte}>
          <div className="reportes__campo">
            <label htmlFor="tipo-reporte">Tipo de reporte</label>
            <select
              id="tipo-reporte"
              className="select"
              value={tipo}
              onChange={(evento) => {
                setTipo(evento.target.value);
                setReporte(null);
                setBusquedaProducto("");
                setBusquedaResponsable("");
              }}
            >
              {tiposReporte.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
              ))}
            </select>
          </div>
          {(tipo === "PRODUCCION" || tipo === "VENTAS") && (
            <div className="reportes__campo">
              <label htmlFor="reporte-buscar-producto">Buscar producto o concepto</label>
              <input
                id="reporte-buscar-producto"
                className="input"
                type="search"
                value={busquedaProducto}
                onChange={(evento) => setBusquedaProducto(evento.target.value)}
                placeholder="Escribí para filtrar"
              />
            </div>
          )}
          {tipo === "PRODUCCION" && (
            <div className="reportes__campo">
              <label htmlFor="reporte-buscar-responsable">Buscar responsable</label>
              <input
                id="reporte-buscar-responsable"
                className="input"
                type="search"
                value={busquedaResponsable}
                onChange={(evento) => setBusquedaResponsable(evento.target.value)}
                placeholder="Nombre de usuario"
              />
            </div>
          )}
          <div className="reportes__campo">
            <label htmlFor="reporte-desde">Desde</label>
            <input
              id="reporte-desde"
              className="input"
              type="date"
              value={fechaDesde}
              onChange={(evento) => setFechaDesde(evento.target.value)}
            />
          </div>
          <div className="reportes__campo">
            <label htmlFor="reporte-hasta">Hasta</label>
            <input
              id="reporte-hasta"
              className="input"
              type="date"
              value={fechaHasta}
              onChange={(evento) => setFechaHasta(evento.target.value)}
            />
          </div>
          <button className="btn btn-primary reportes__accion" type="submit" disabled={cargando}>
            <Search size={17} aria-hidden="true" />
            {cargando ? "Generando..." : "Generar reporte"}
          </button>
            </form>

            {tipo === "INSUMOS" && (
              <p className="reportes__nota">
                Se muestran los insumos registrados en cada elaboración y sus cantidades utilizadas, sin costos.
              </p>
            )}
            {tipo === "STOCK" && (
              <p className="reportes__nota">
                El stock actual refleja las existencias de hoy; las entradas y salidas corresponden al período seleccionado.
              </p>
            )}
            {error && <p className="reportes__mensaje reportes__mensaje--error" role="alert">{error}</p>}

            {reporteFiltrado && (
              <section className="reportes__resultado" aria-live="polite">
                <div className="reportes__encabezado">
                  <div>
                    <h3>{reporteFiltrado.titulo}</h3>
                    <p>
                      {reporteFiltrado.fechaDesde || "Sin fecha inicial"} — {reporteFiltrado.fechaHasta || "Sin fecha final"}
                      {" · "}{reporteFiltrado.filas.length} registro(s)
                    </p>
                  </div>
                  <button className="btn btn-primary reportes__accion" type="button" onClick={exportarExcel}>
                    <Download size={17} aria-hidden="true" />
                    Exportar Excel
                  </button>
                </div>

                {(() => {
                  const esTotalLeche = (etiqueta) => /^Litros |asignados$|utilizados$/.test(etiqueta);
                  const entradas = Object.entries(reporteFiltrado.totales || {});
                  const generales = entradas.filter(([etiqueta]) => !esTotalLeche(etiqueta));
                  const leche = entradas.filter(([etiqueta]) => esTotalLeche(etiqueta));
                  const tarjeta = ([etiqueta, valor]) => (
                    <div className="reportes__total" key={etiqueta}>
                      <span>{etiqueta}</span>
                      <strong>{formatoNumero.format(Number(valor))}</strong>
                    </div>
                  );
                  return (
                    <>
                      {generales.length > 0 && (
                        <div className="reportes__totales">{generales.map(tarjeta)}</div>
                      )}
                      {leche.length > 0 && (
                        <div className="reportes__leche">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            aria-expanded={lecheAbierta}
                            onClick={() => setLecheAbierta((abierta) => !abierta)}
                          >
                            Leche {lecheAbierta ? "▲" : "▼"}
                          </button>
                          {lecheAbierta && (
                            <div className="reportes__totales">{leche.map(tarjeta)}</div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
                {reporteFiltrado.filas.length > 0 ? (
                  <div className="table-container">
                    <table className="table reportes__tabla">
                      <thead>
                        <tr>{reporteFiltrado.columnas.map((columna) => <th key={columna}>{columna}</th>)}</tr>
                      </thead>
                      <tbody>
                        {reporteFiltrado.filas.map((fila, indice) => (
                          <tr key={`${fila.Fecha || "fila"}-${fila.Venta || fila.Producto || fila.Insumo || indice}-${indice}`}>
                            {reporteFiltrado.columnas.map((columna) => (
                              <td key={columna}>{mostrarValor(fila[columna])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="reportes__vacio">
                    <FileBarChart2 size={26} aria-hidden="true" />
                    <p>No hay registros para los filtros seleccionados.</p>
                  </div>
                )}
              </section>
            )}
          </section>
        )}

        {pestanaActiva === "mensuales" && (
        <section
          className="reportes__mensuales"
          id="panel-reportes-mensuales"
          role="tabpanel"
          aria-labelledby="tab-reportes-mensuales"
        >
          <div className="reportes__encabezado">
            <div>
              <h3 id="reportes-mensuales-titulo">Reportes generales mensuales</h3>
              <p>Se genera y queda disponible para descargar el primer día de cada mes, con los datos del mes cerrado.</p>
            </div>
          </div>
          {errorMensuales && (
            <p className="reportes__mensaje reportes__mensaje--error" role="alert">{errorMensuales}</p>
          )}
          {cargandoMensuales ? (
            <p className="reportes__nota">Cargando archivo mensual...</p>
          ) : reportesMensuales.length > 0 ? (
            <div className="table-container">
              <table className="table reportes__tabla-mensual">
                <thead>
                  <tr>
                    <th>Período</th>
                    <th>Generado</th>
                    <th>Archivo</th>
                  </tr>
                </thead>
                <tbody>
                  {reportesMensuales.map((mensual) => (
                    <tr key={mensual.periodo}>
                      <td>{mensual.periodo}</td>
                      <td>{mensual.fechaGeneracion
                        ? new Date(mensual.fechaGeneracion).toLocaleString("es-AR")
                        : "—"}</td>
                      <td>
                        <button
                          className="btn btn-primary reportes__accion"
                          type="button"
                          onClick={() => descargarReporteMensual(mensual.periodo)}
                        >
                          <Download size={16} aria-hidden="true" />
                          Descargar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="reportes__vacio">
              <FileBarChart2 size={26} aria-hidden="true" />
              <p>Todavía no hay reportes mensuales archivados.</p>
            </div>
          )}
        </section>
        )}

      </Card>
    </div>
  );
}

export default Reportes;
