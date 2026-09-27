import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import Card from "../../components/ui/Card";
import api from "../../services/api";

const COLUMNAS_REQUERIDAS = ["Fecha", "Concepto", "Cantidad", "Unitario", "Total"];

function fechaExcelAISO(valor) {
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) return valor.toISOString().slice(0, 10);
  if (typeof valor === "number") {
    const fecha = XLSX.SSF.parse_date_code(valor);
    if (fecha) return `${fecha.y}-${String(fecha.m).padStart(2, "0")}-${String(fecha.d).padStart(2, "0")}`;
  }
  const partes = String(valor ?? "").trim().split(new RegExp("[/-]"));
  if (partes.length === 3 && partes[2].length === 4) {
    return `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(2, "0")}`;
  }
  return /^\d{4}-\d{2}-\d{2}$/.test(String(valor).trim()) ? String(valor).trim() : "";
}

function numeroExcel(valor) {
  if (typeof valor === "number") return valor;
  return Number(String(valor ?? "").replace(/\s/g, "").replace(",", "."));
}

function Ventas() {
  const inputArchivo = useRef(null);
  const [registros, setRegistros] = useState([]);
  const [archivo, setArchivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const seleccionarArchivo = async (evento) => {
    const archivoSeleccionado = evento.target.files?.[0];
    evento.target.value = "";
    setMensaje("");
    setError("");
    if (!archivoSeleccionado || !archivoSeleccionado.name.toLowerCase().endsWith(".xlsx")) {
      setError("Seleccione un archivo con extensión .xlsx.");
      return;
    }
    try {
      const libro = XLSX.read(await archivoSeleccionado.arrayBuffer(), { cellDates: true });
      const hoja = libro.Sheets[libro.SheetNames[0]];
      const filas = XLSX.utils.sheet_to_json(hoja, { defval: null, raw: true });
      const faltantes = COLUMNAS_REQUERIDAS.filter((columna) => !Object.keys(filas[0] ?? {}).includes(columna));
      if (faltantes.length > 0) {
        setError(`Faltan columnas obligatorias: ${faltantes.join(", ")}.`);
        return;
      }
      const ventas = filas
        .filter((fila) => fila.Concepto !== null && String(fila.Concepto).trim() !== "")
        .map((fila) => ({
          fecha: fechaExcelAISO(fila.Fecha),
          concepto: String(fila.Concepto).trim(),
          cantidad: numeroExcel(fila.Cantidad),
          unitario: numeroExcel(fila.Unitario),
          total: numeroExcel(fila.Total),
        }));
      if (ventas.length === 0 || ventas.some((venta) => !venta.fecha || !Number.isFinite(venta.cantidad))) {
        setError("El archivo no contiene filas de ventas válidas.");
        return;
      }
      setArchivo(archivoSeleccionado.name);
      setRegistros(ventas);
      setMensaje(`${ventas.length} venta(s) listas para importar.`);
    } catch {
      setError("No se pudo leer el archivo Excel.");
    }
  };

  const importarVentas = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    if (!usuario?.idUsuario) {
      setError("La sesión no contiene un usuario válido.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const respuesta = await api.post("/ventas/importar", { idUsuario: usuario.idUsuario, ventas: registros });
      setMensaje(respuesta.data.mensaje);
      setRegistros([]);
      setArchivo("");
    } catch (e) {
      const detalle = e.response?.data?.mensaje || e.response?.data?.message || e.response?.data?.error;
      if (detalle) {
        setError(`No se pudo importar el archivo: ${detalle}`);
      } else if (e.response) {
        setError(`El servidor respondió con un error HTTP ${e.response.status}. Revise los logs del backend.`);
      } else if (e.request) {
        setError("No se pudo importar el archivo porque el servidor no responde. Verifique que el backend esté iniciado.");
      } else {
        setError("No se pudo importar el archivo por un error inesperado. Intente nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pagina">
      <Card title="· VENTAS ·">
        <input ref={inputArchivo} type="file" accept=".xlsx" onChange={seleccionarArchivo} hidden />
        <button className="btn btn-primary" type="button" onClick={() => inputArchivo.current?.click()}>
          Seleccionar archivo .xlsx
        </button>
        {archivo && <p>{archivo}</p>}
        {mensaje && <p role="status">{mensaje}</p>}
        {error && <p role="alert">{error}</p>}
        {registros.length > 0 && (
          <>
            <button className="btn btn-primary" type="button" onClick={importarVentas} disabled={cargando}>
              {cargando ? "Importando..." : "Confirmar importación"}
            </button>
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Fecha</th><th>Producto</th><th>Precio unitario</th><th>Importe</th><th>Unidades vendidas</th></tr></thead>
                <tbody>{registros.map((registro, indice) => (
                  <tr key={`${registro.concepto}-${indice}`}>
                    <td>{registro.fecha}</td><td>{registro.concepto}</td><td>{registro.unitario}</td><td>{registro.total}</td><td>{registro.cantidad}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default Ventas;