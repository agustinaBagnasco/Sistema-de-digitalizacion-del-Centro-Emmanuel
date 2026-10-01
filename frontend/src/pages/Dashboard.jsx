import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import api from "../services/api";
import { formatearNumero } from "../utils/formatNumber";
import "./Dashboard.css";

const rutasPorCategoria = {
    DULCEDELECHE: "/lacteos/DulceDeLeche",
    QUESO: "/lacteos/Quesos",
    LECHE: "/lacteos/Leche",
    MERMELADA: "/alimentos-procesados/Mermeladas",
    MOLIENDA: "/alimentos-procesados/Molienda",
};

function sumar(cantidad) {
    return formatearNumero(cantidad);
}

function agruparElaboraciones(elaboraciones) {
    const grupos = new Map();

    elaboraciones.forEach((elaboracion) => {
        const salidas = [
            {
                producto: elaboracion.productoElaborado1kg,
                cantidad: elaboracion.cantidadFrascos1kg,
            },
            {
                producto: elaboracion.productoElaborado420g,
                cantidad: elaboracion.cantidadFrascos420g,
            },
        ].filter((salida) => salida.producto && Number(salida.cantidad) > 0);

        const salidasParaMostrar = salidas.length
            ? salidas
            : [{
                producto: elaboracion.productoElaborado,
                cantidad: elaboracion.cantidadProducida,
            }];

        salidasParaMostrar.forEach(({ producto, cantidad }) => {
            if (!producto) return;

            const id = producto.idProducto ?? producto.nombreProducto;
            const grupo = grupos.get(id) || {
                nombre: producto.nombreProducto || "Producto",
                cantidad: 0,
                unidad: producto.categoria === "QUESO" ? "hormas" : (producto.unidadMedida || ""),
                categoria: producto.categoria,
            };
            grupo.cantidad += Number(cantidad) || 0;
            grupos.set(id, grupo);
        });
    });

    return Array.from(grupos.values());
}

export default function Dashboard() {
    const fechaActual = new Date();
    const mesActual = fechaActual.toLocaleDateString("es-UY", { month: "long" });
    const añoActual = fechaActual.getFullYear();
    const [datos, setDatos] = useState({ elaboraciones: [], produccionLeche: [], alertasStock: [] });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let activo = true;

        async function cargarDashboard() {
            try {
                const [elaboraciones, produccionLeche, alertasStock] = await Promise.all([
                    api.get("/elaboraciones"),
                    api.get("/produccion-leche"),
                    api.get("/stock/alertas-stock-minimo"),
                ]);

                if (activo) {
                    setDatos({
                        elaboraciones: elaboraciones.data,
                        produccionLeche: produccionLeche.data,
                        alertasStock: alertasStock.data,
                    });
                }
            } catch (errorCarga) {
                console.error("Error al cargar el dashboard:", errorCarga);
                if (activo) setError("No se pudieron cargar los datos del dashboard.");
            } finally {
                if (activo) setCargando(false);
            }
        }

        void cargarDashboard();
        return () => { activo = false; };
    }, []);

    const claveMes = `${añoActual}-${String(fechaActual.getMonth() + 1).padStart(2, "0")}`;
    const elaboracionesMes = datos.elaboraciones.filter((item) =>
        item.fechaElaboracion?.startsWith(claveMes)
    );
    const hoy = new Date();
    const claveHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
    const productosElaborados = agruparElaboraciones(elaboracionesMes);
    const hormasElaboradas = agruparElaboraciones(elaboracionesMes.filter((item) =>
        item.productoElaborado?.categoria === "QUESO"
    ));
    const produccionLecheMes = datos.produccionLeche.filter((registro) =>
        registro.fecha?.startsWith(claveMes)
    );
    const lecheProducida = produccionLecheMes
        .reduce((total, registro) => total + [
            registro.litrosTerneros,
            registro.ventaDirecta,
            registro.consumoCocina,
            registro.elaboracionQuesos,
            registro.elaboracionDulceDeLeche,
            registro.elaboracionQuark,
        ].reduce((suma, litros) => suma + (Number(litros) || 0), 0), 0);
    const productosBajoStock = datos.alertasStock.filter((producto) =>
        producto.tipo === "PRODUCTO" && producto.activo
    );
    const insumosBajoStock = datos.alertasStock.filter((producto) =>
        producto.tipo === "INSUMO" && producto.activo
    );
    const proximasElaboraciones = datos.elaboraciones
        .filter((item) => item.fechaElaboracion > claveHoy)
        .sort((a, b) => a.fechaElaboracion.localeCompare(b.fechaElaboracion))
        .slice(0, 5);
    const rutaProximaElaboracion = rutasPorCategoria[
        proximasElaboraciones[0]?.productoElaborado?.categoria
    ] || "/administracion/Movimientos";
    const rutaProductosElaborados = rutasPorCategoria[productosElaborados[0]?.categoria]
        || "/administracion/Movimientos";

    const tarjeta = (titulo, ruta, contenido, clase = "") => (
        <Card
            title={<Link className="dashboard-card-link" to={ruta}>{titulo}</Link>}
            className={`dashboard-tile ${clase}`}
            key={titulo}
        >
            {contenido}
        </Card>
    );

    return (
        <div className="pagina">
            <Card title={`· ${mesActual.toUpperCase()} ${añoActual} ·`}>
                {error && <p className="dashboard-message" role="alert">{error}</p>}
                <div className="dashboard-grid" aria-busy={cargando}>
                    {tarjeta("Productos elaborados", rutaProductosElaborados, cargando ? <p>Cargando...</p> : productosElaborados.length ? (
                        <div className="dashboard-scroll-list">
                            {productosElaborados.map((producto) => (
                                <p key={producto.nombre}>{producto.nombre}: {sumar(producto.cantidad)} {producto.unidad}</p>
                            ))}
                        </div>
                    ) : <p>No hay elaboraciones registradas este mes.</p>)}

                    {tarjeta("Leche producida", "/lacteos/Leche", cargando ? <p>Cargando...</p> : (
                        produccionLecheMes.length
                            ? <p className="dashboard-total">{sumar(lecheProducida)} litros</p>
                            : <p>No hay registros de producción este mes.</p>
                    ))}

                    {tarjeta("Hormas elaboradas", "/lacteos/Quesos", cargando ? <p>Cargando...</p> : hormasElaboradas.length ? (
                        hormasElaboradas.slice(0, 5).map((producto) => (
                            <p key={producto.nombre}>{producto.nombre}: {sumar(producto.cantidad)} hormas</p>
                        ))
                    ) : <p>No hay hormas registradas este mes.</p>)}

                    {tarjeta("Productos bajo stock", "/administracion/Movimientos", cargando ? <p>Cargando...</p> : productosBajoStock.length ? (
                        productosBajoStock.slice(0, 5).map((producto) => (
                            <p key={producto.idProducto}>{producto.nombreProducto}: {sumar(producto.stockActual)} / {sumar(producto.stockMinimo)} {producto.unidadMedida}</p>
                        ))
                    ) : <p>No hay productos críticos.</p>)}

                    {tarjeta("Insumos bajo stock", "/administracion/Movimientos", cargando ? <p>Cargando...</p> : insumosBajoStock.length ? (
                        insumosBajoStock.slice(0, 5).map((producto) => (
                            <p key={producto.idProducto}>{producto.nombreProducto}: {sumar(producto.stockActual)} / {sumar(producto.stockMinimo)} {producto.unidadMedida}</p>
                        ))
                    ) : <p>No hay insumos críticos.</p>)}

                    {tarjeta("Próximas elaboraciones", rutaProximaElaboracion, cargando ? <p>Cargando...</p> : proximasElaboraciones.length ? (
                        proximasElaboraciones.map((elaboracion) => (
                            <p key={elaboracion.idElaboracion}>
                                {elaboracion.productoElaborado?.nombreProducto || "Producto"}: {elaboracion.fechaElaboracion}
                            </p>
                        ))
                    ) : <p>No hay elaboraciones futuras registradas.</p>)}
                </div>
            </Card>
        </div>
    );
}

