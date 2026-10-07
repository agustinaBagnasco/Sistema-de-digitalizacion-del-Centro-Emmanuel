import { useEffect, useState } from "react";
import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    tipos,
    categorias, 
    unidadesMedida
} from "../../services/producto";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import { formatearNumero } from "../../utils/formatNumber";
import { sortActiveLast } from "../../utils/sortActiveLast";
import "../../styles/global.css";
import "./ProductoInsumo.css";


function Productos() {
    const [productos, setProductos] = useState([]);
    const [tipoActivo, setTipoActivo] = useState("PRODUCTO");
    const [mostrarModal, setMostrarModal] = useState(false);

    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);

    const [nombreProducto, setNombreProducto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [stockActual, setStockActual] = useState("");
    const [stockMinimo, setStockMinimo] = useState("");
    const [costo, setCosto] = useState("");
    const [activo, setActivo] = useState(true);
    const [tipo, setTipo] = useState("PRODUCTO");
    const [categoria, setCategoria] = useState("");
    const [unidadMedida, setUnidadMedida] = useState("");
    const [pesoHorma, setPesoHorma] = useState("");
    const [productoResultadoId, setProductoResultadoId] = useState("");
    const esGrano = categoria === "GRANOS";
    const opcionesProductoResultado = productos
        .filter((p) => p.categoria === "MOLIENDA" && p.tipo === "PRODUCTO" && p.activo)
        .map((p) => ({ value: String(p.idProducto), label: p.nombreProducto }));
    const manejaHorma = categoria === "QUESO" && unidadMedida !== "UNIDAD";

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const [filtros, setFiltros] = useState({
        PRODUCTO: { busqueda: "", categoria: "", estado: "" },
        INSUMO: { busqueda: "", categoria: "", estado: "" },
    });

    // ========================= CARGAR DATOS =========================

    const cargarProductos = async () => {

        try {
            setCargando(true);
            const respuesta = await obtenerProductos();
            setProductos(respuesta.data);

        } catch (error) {

            console.error("Error al cargar productos:", error);
            setError("No se pudieron cargar los productos.");

        } finally {

            setCargando(false);
        }
    };

    useEffect(() => {
        void Promise.resolve().then(cargarProductos);
    }, []);

    // ========================= LIMPIAR FORMULARIO =========================

    const limpiarFormulario = () => {

        setNombreProducto("");
        setDescripcion("");
        setStockActual("");
        setStockMinimo("");
        setCosto("");
        setTipo("PRODUCTO");
        setCategoria("");
        setUnidadMedida("");
        setPesoHorma("");
        setProductoResultadoId("");
        setActivo(true);

        setProductoEditando(null);
        setModoEdicion(false);

        setError("");
    };


    // ========================= ABRIR MODAL NUEVO =========================

    const abrirNuevoRegistro = (tipoNuevo) => {
        limpiarFormulario();
        setTipo(tipoNuevo);
        setTipoActivo(tipoNuevo);
        setTimeout(() => {
            document.getElementById("formulario-producto")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
        setMostrarModal(true);
    };


    // ========================= ABRIR MODAL EDITAR =========================

    const abrirEditarProducto = (producto) => {

        setModoEdicion(true);
        setProductoEditando(producto);
        setTipoActivo(producto.tipo || "PRODUCTO");

        setNombreProducto(producto.nombreProducto || "");
        setDescripcion(producto.descripcion || "");

        setStockActual(
            producto.stockActual !== null &&
                producto.stockActual !== undefined
                ? producto.stockActual
                : ""
        );

        setStockMinimo(
            producto.stockMinimo !== null &&
                producto.stockMinimo !== undefined
                ? producto.stockMinimo
                : ""
        );
        setCosto(
            producto.costo !== null &&
                producto.costo !== undefined
                ? producto.costo
                : ""
        );
        setTipo(producto.tipo || "PRODUCTO");

        setCategoria(producto.categoria || "");

        setUnidadMedida(producto.unidadMedida || (producto.categoria === "QUESO" ? "KG" : ""));
        setPesoHorma(
            producto.pesoHorma !== null && producto.pesoHorma !== undefined
                ? String(producto.pesoHorma)
                : ""
        );
        setProductoResultadoId(
            producto.productoResultado?.idProducto != null
                ? String(producto.productoResultado.idProducto)
                : ""
        );

        setActivo(producto.activo);

        setTimeout(() => {
            document.getElementById("formulario-producto")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);

        setError("");

        setMostrarModal(true);
    };

    // ========================= CERRAR MODAL =========================

    const cerrarModal = () => {
        setMostrarModal(false);
        limpiarFormulario();
    };

    // ========================= GUARDAR PRODUCTO =========================

    const guardarProducto = async (e) => {

        e.preventDefault();
        setError("");
        const nombreTipo = tipo === "INSUMO" ? "insumo" : "producto";

        // Validaciones

        if (!nombreProducto.trim()) {

            setError(`El nombre del ${nombreTipo} es obligatorio.`);
            return;
        }
        if (!categoria) {

            setError(`Debe seleccionar una categoría para el ${nombreTipo}.`);
            return;
        }

        if (manejaHorma && (pesoHorma === "" || !Number.isFinite(Number(pesoHorma)))) {
            setError("Debe indicar cuánto pesa la horma de queso. Ingrese 0 si se manejará solo en kilos.");
            return;
        }

        if (manejaHorma && Number(pesoHorma) < 0) {
            setError("El peso de la horma no puede ser negativo.");
            return;
        }

        if (!unidadMedida) {

            setError(`Debe seleccionar una unidad de medida para el ${nombreTipo}.`);
            return;
        }

        const producto = {

            nombreProducto: nombreProducto.trim(),
            descripcion: descripcion.trim(),
            stockActual: stockActual === ""
                ? 0
                : Number(stockActual),

            stockMinimo: stockMinimo === ""
                ? 0
                : Number(stockMinimo),
            categoria,
            ...(tipo === "PRODUCTO" && {
                costo: costo === "" ? 0 : Number(costo),
            }),
            pesoHorma: manejaHorma ? Number(pesoHorma) : null,
            productoResultado: esGrano && productoResultadoId
                ? { idProducto: Number(productoResultadoId) }
                : null,
            activo: activo,
            tipo: tipo,
            unidadMedida: unidadMedida,

        };

        try {
            if (modoEdicion) {

                await actualizarProducto(
                    productoEditando.idProducto,
                    producto)

            } else {
                const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
                await crearProducto(producto, usuario?.idUsuario);

            }

            await cargarProductos();
            cerrarModal();

        } catch (error) {

            console.error(`Error al guardar ${nombreTipo}:`, error);
            const mensajeServidor = error.response?.data?.mensaje || error.response?.data?.message;
            const estadoHttp = error.response?.status ? ` (HTTP ${error.response.status})` : "";
            setError(mensajeServidor || `No se pudo guardar el ${nombreTipo}${estadoHttp}.`);
        }
    };

    // ========================= ACTIVAR / DESACTIVAR =========================

    const cambiarEstado = async (producto) => {

        try {
            const productoActualizado = {

                nombreProducto: producto.nombreProducto,
                descripcion: producto.descripcion,
                stockActual: producto.stockActual,
                stockMinimo: producto.stockMinimo,
                ...(producto.tipo === "PRODUCTO" && { costo: producto.costo }),
                activo: !producto.activo,
                tipo: producto.tipo,
                categoria: producto.categoria,
                pesoHorma: producto.pesoHorma ?? null,
                productoResultado: producto.productoResultado
                    ? { idProducto: producto.productoResultado.idProducto }
                    : null,
                unidadMedida: producto.unidadMedida
            };

            await actualizarProducto(
                producto.idProducto,
                productoActualizado)

            await cargarProductos();

        } catch (error) {

            console.error("Error al cambiar estado:", error);
            setError(error.response?.data?.mensaje || "No se pudo cambiar el estado del producto.");
        }
    };

    // ========================= BUSQUEDA Y FILTROS =========================

    const filtrosActivos = filtros[tipoActivo];
    const productosFiltrados = sortActiveLast(productos.filter((producto) => {
        if (producto.tipo !== tipoActivo) {
            return false;
        }

        const coincideBusqueda = String(producto.nombreProducto || "")
            .toLocaleLowerCase("es")
            .includes(filtrosActivos.busqueda.trim().toLocaleLowerCase("es"));
        const coincideCategoria =
            !filtrosActivos.categoria || producto.categoria === filtrosActivos.categoria;
        const coincideEstado =
            !filtrosActivos.estado
            || (filtrosActivos.estado === "ACTIVO" && producto.activo)
            || (filtrosActivos.estado === "INACTIVO" && !producto.activo);

        return coincideBusqueda && coincideCategoria && coincideEstado;
    }));

    const actualizarFiltro = (campo, valor) => {
        setFiltros((filtrosActuales) => ({
            ...filtrosActuales,
            [tipoActivo]: {
                ...filtrosActuales[tipoActivo],
                [campo]: valor,
            },
        }));
    };



    // ========================= ELIMINAR =========================

    const eliminarProductoTabla = async (producto) => {

        const confirmar = window.confirm(
            `¿Está seguro que desea eliminar el producto "${producto.nombreProducto}"?`
        );

        if (!confirmar) {
            return;
        }

        try {

            await eliminarProducto(producto.idProducto);


            await cargarProductos();

        } catch (error) {

            console.error("Error al eliminar producto:", error);
            setError(error.response?.data?.mensaje || "No se pudo eliminar el producto.");
        }
    };

    return (
        <div className="pagina">
            <Card title="· PRODUCTOS / INSUMOS ·">
                <div className="producto-insumo-tabs" role="tablist" aria-label="Tipo de registro">
                    {tipos.map((opcion) => (
                        <button
                            key={opcion.value}
                            id={`tab-${opcion.value.toLowerCase()}`}
                            className={`producto-insumo-tab${tipoActivo === opcion.value ? " producto-insumo-tab--activo" : ""}`}
                            type="button"
                            role="tab"
                            aria-selected={tipoActivo === opcion.value}
                            aria-controls="panel-productos-insumos"
                            onClick={() => setTipoActivo(opcion.value)}
                        >
                            {opcion.label}
                            <span>{productos.filter((producto) => producto.tipo === opcion.value).length}</span>
                        </button>
                    ))}
                </div>

                <Button
                    className="btn btn-primary"
                    onClick={() => abrirNuevoRegistro(tipoActivo)}
                >
                    + Nuevo {tipoActivo === "INSUMO" ? "insumo" : "producto"}
                </Button>

                {/* =========================  ERROR  ========================= */}

                {error && (

                    <div className="mensaje-error">
                        {error}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setError("")}> × </Button>
                    </div>
                )}

                {/* ========================= TABLA ========================= */}

                <div
                    className="productos-filtros"
                    role="tabpanel"
                    id="panel-productos-insumos"
                    aria-labelledby={`tab-${tipoActivo.toLowerCase()}`}
                >

                    <Input
                        type="search"
                        placeholder={`Buscar ${tipoActivo === "INSUMO" ? "insumo" : "producto"}...`}
                        value={filtrosActivos.busqueda}
                        onChange={(e) => actualizarFiltro("busqueda", e.target.value)}
                    />

                    <Select
                        value={filtrosActivos.categoria}
                        onChange={(e) => actualizarFiltro("categoria", e.target.value)}
                        options={[
                            { value: "", label: "Todas las categorías" },
                            ...categorias
                        ]}
                    />

                    <Select
                        value={filtrosActivos.estado}
                        onChange={(e) => actualizarFiltro("estado", e.target.value)}
                        options={[
                            { value: "", label: "Todos los estados" },
                            { value: "ACTIVO", label: "Activos" },
                            { value: "INACTIVO", label: "Inactivos" }
                        ]}
                    />

                </div>

                <div className="productos-table-container">
                    {cargando ? (
                        <p className="mensaje-cargando">
                            Cargando {tipoActivo === "INSUMO" ? "insumos" : "productos"}...
                        </p>
                    ) : productos.filter((producto) => producto.tipo === tipoActivo).length === 0 ? (
                        <div>
                            <p>No hay {tipoActivo === "INSUMO" ? "insumos" : "productos"} registrados.</p>
                            <Button
                                className="btn btn-primary"
                                onClick={() => abrirNuevoRegistro(tipoActivo)}
                            >
                                Agregar {tipoActivo === "INSUMO" ? "primer insumo" : "primer producto"}
                            </Button>

                        </div>

                    ) : productosFiltrados.length === 0 ? (
                        <p>No hay {tipoActivo === "INSUMO" ? "insumos" : "productos"} que coincidan con los filtros.</p>
                    ) : (

                        <div className="table-container">
                            <table className="table">
                                <thead style={{ backgroundColor: "#f2f2f2" }}>
                                    <tr>
                                        <th>{tipoActivo === "INSUMO" ? "Insumo" : "Producto"}</th>
                                        <th>Descripción</th>
                                        <th>Categoría</th>
                                        <th>Unidad</th>
                                        <th>Stock actual</th>
                                        <th>Stock mínimo</th>
                                        {tipoActivo === "PRODUCTO" && <th>Costo</th>}
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {productosFiltrados.map((producto) => (
                                        <tr key={producto.idProducto}>
                                            <td>
                                                <strong>{producto.nombreProducto}</strong>
                                            </td>

                                            <td>{producto.descripcion || "-"}</td>
                                            <td>{producto.categoria || "-"}</td>

                                            <td>{producto.unidadMedida || "-"}</td>


                                            <td>{formatearNumero(producto.stockActual)}</td>

                                            <td>{formatearNumero(producto.stockMinimo)}</td>
                                            {tipoActivo === "PRODUCTO" && <td>{formatearNumero(producto.costo)}</td>}
                                            <td>
                                                <span
                                                    className={
                                                        producto.activo
                                                            ? "estado activo"
                                                            : "estado inactivo"
                                                    }
                                                >
                                                    {producto.activo
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
                                                            abrirEditarProducto(producto)
                                                        }
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant={
                                                            producto.activo
                                                                ? "warning"
                                                                : "primary"
                                                        }
                                                        onClick={() =>
                                                            cambiarEstado(producto)
                                                        }
                                                    >
                                                        {producto.activo
                                                            ? "Desactivar"
                                                            : "Activar"
                                                        }
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() =>
                                                            eliminarProductoTabla(producto)
                                                        }
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ========================= MODAL ========================= */}
                {mostrarModal && (

                    <div className="modal-overlay">
                        <div >
                            {/* HEADER MODAL */}
                            <div >
                                <div>
                                    <br />
                                    <h2>
                                        {modoEdicion
                                            ? `Editar ${tipo === "INSUMO" ? "insumo" : "producto"}`
                                            : `Nuevo ${tipo === "INSUMO" ? "insumo" : "producto"}`
                                        }
                                    </h2>
                                    <hr />
                                    <p>
                                        {modoEdicion
                                            ? `Modifique los datos del ${tipo === "INSUMO" ? "insumo" : "producto"}.`
                                            : `Ingrese los datos del nuevo ${tipo === "INSUMO" ? "insumo" : "producto"}.`
                                        }
                                    </p>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={cerrarModal}
                                    >
                                        Cerrar
                                    </Button>
                                </div>
                            </div>
                            <br />

                            {/* FORMULARIO */}
                            <form onSubmit={guardarProducto} id="formulario-producto" className="form-field columns-2">
                                {/* NOMBRE */}
                                <div className="form-group">
                                    <label>Nombre del {tipo === "INSUMO" ? "insumo" : "producto"} *</label>
                                    <Input
                                        type="text"
                                        value={nombreProducto}
                                        onChange={(e) =>
                                            setNombreProducto(e.target.value)
                                        }
                                        placeholder="Ej. Dulce de leche"
                                    />
                                </div>

                                {/* DESCRIPCIÓN */}
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <Textarea
                                        value={descripcion}
                                        onChange={(e) =>
                                            setDescripcion(e.target.value)
                                        }
                                        placeholder="Descripción del producto"
                                        rows="3"
                                    />
                                </div>

                                {/* CATEGORÍA */}
                                <div className="form-group">
                                    <label>Categoría *</label>

                                    <Select
                                        value={categoria}
                                        onChange={(e) => {
                                            const nuevaCategoria = e.target.value;
                                            setCategoria(nuevaCategoria);
                                            if (nuevaCategoria === "QUESO" && categoria !== "QUESO") {
                                                setUnidadMedida("KG");
                                                setPesoHorma("");
                                            } else if (categoria === "QUESO") {
                                                setUnidadMedida("");
                                                setPesoHorma("");
                                            }
                                        }}
                                        options={categorias}
                                        placeholder="Seleccione una categoría"
                                    />
                                </div>

                                {manejaHorma && (
                                    <div className="form-group">
                                        <label htmlFor="peso-horma">Peso de la horma (kg) *</label>
                                        <Input
                                            id="peso-horma"
                                            type="number"
                                            min="0"
                                            step="0.001"
                                            value={pesoHorma}
                                            onChange={(e) => setPesoHorma(e.target.value)}
                                            required
                                        />
                                        <small>
                                            {pesoHorma === ""
                                                ? "Ingrese 0 si este queso se manejará únicamente en kilogramos."
                                                : Number(pesoHorma) === 0
                                                    ? "Este queso se registrará y producirá únicamente en kilogramos."
                                                    : "La producción se podrá registrar en hormas y se convertirá a kilogramos."}
                                        </small>
                                    </div>
                                )}

                                {esGrano && (
                                    <div className="form-group">
                                        <label>Producto de molienda resultante</label>
                                        <Select
                                            value={productoResultadoId}
                                            onChange={(e) => setProductoResultadoId(e.target.value)}
                                            options={opcionesProductoResultado}
                                            placeholder="Seleccione el producto de molienda"
                                        />
                                        <small>
                                            Es el producto que se obtiene al moler este grano en Molienda.
                                        </small>
                                    </div>
                                )}

                                {/* UNIDAD */}
                                <div className="form-group">
                                    <label>Unidad de medida *</label>
                                    <Select
                                        value={unidadMedida}
                                        onChange={(e) => setUnidadMedida(e.target.value)}
                                        options={unidadesMedida}
                                        placeholder="Seleccione una unidad"
                                    />
                                    {categoria === "QUESO" && (
                                        <small>
                                            {unidadMedida === "UNIDAD"
                                                ? "Este queso se maneja por unidades (por ejemplo, frascos)."
                                                : "Elija Unidades para quesos que se manejan en frascos, como el Quark."}
                                        </small>
                                    )}
                                </div>

                                {/* STOCK */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Stock inicial</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={stockActual}
                                            onChange={(e) =>
                                                setStockActual(e.target.value)
                                            }
                                        />

                                    </div>
                                    <div className="form-group">
                                        <label>Stock mínimo</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={stockMinimo}
                                            onChange={(e) =>
                                                setStockMinimo(e.target.value)
                                            }
                                        />
                                    </div>
                                    {tipo === "PRODUCTO" && <div className="form-group">
                                        <label>Costo</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={costo}
                                            onChange={(e) =>
                                                setCosto(e.target.value)
                                            }
                                        />
                                    </div>}

                                </div>
                                {/* ACTIVO */}
                                <div className="form-group checkbox-group">
                                    <label>
                                        <Input
                                            type="checkbox"
                                            checked={activo}
                                            onChange={(e) =>
                                                setActivo(e.target.checked)
                                            }
                                        />
                                        {tipo === "INSUMO" ? "Insumo activo" : "Producto activo"}
                                    </label>
                                </div>

                                {/* ERROR */}

                                {error && (
                                    <div className="modal-error">
                                        {error}
                                    </div>
                                )}

                                {/* BOTONES */}
                                <div className="modal-footer">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={cerrarModal}
                                    >
                                        Cancelar
                                    </Button>

                                    <Button
                                        type="submit"
                                        className={`btn btn-${"primary"}`}
                                    >
                                        {modoEdicion
                                            ? "Guardar cambios"
                                            : `Crear ${tipo === "INSUMO" ? "insumo" : "producto"}`
                                        }
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </Card>
        </div>
    );

}

export default Productos;