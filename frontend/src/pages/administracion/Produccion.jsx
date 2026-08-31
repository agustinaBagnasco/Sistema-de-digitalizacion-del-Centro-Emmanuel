import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";


function Produccion() {

    // =========================
    // ESTADOS
    // =========================

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [unidadesMedida, setUnidadesMedida] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);

    const [nombreProducto, setNombreProducto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [stockActual, setStockActual] = useState("");
    const [stockMinimo, setStockMinimo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [unidadMedida, setUnidadMedida] = useState("");
    const [activo, setActivo] = useState(true);

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);


    // =========================
    // CARGAR DATOS
    // =========================

    useEffect(() => {
        cargarProductos();
        cargarCategorias();
        cargarUnidadesMedida();
    }, []);


    const cargarProductos = async () => {

        try {

            setCargando(true);

            const respuesta = await api.get("/productos");

            setProductos(respuesta.data);

        } catch (error) {

            console.error("Error al cargar productos:", error);

            setError("No se pudieron cargar los productos.");

        } finally {

            setCargando(false);

        }
    };


    const cargarCategorias = async () => {

        try {

            const respuesta = await api.get("/categorias");

            setCategorias(respuesta.data);

        } catch (error) {

            console.error("Error al cargar categorías:", error);

        }
    };


    const cargarUnidadesMedida = async () => {

        try {

            const respuesta = await api.get("/unidades-medida");

            setUnidadesMedida(respuesta.data);

        } catch (error) {

            console.error("Error al cargar unidades de medida:", error);

        }
    };


    // =========================
    // LIMPIAR FORMULARIO
    // =========================

    const limpiarFormulario = () => {

        setNombreProducto("");
        setDescripcion("");
        setStockActual("");
        setStockMinimo("");
        setCategoria("");
        setUnidadMedida("");
        setActivo(true);

        setProductoEditando(null);
        setModoEdicion(false);

        setError("");
    };


    // =========================
    // ABRIR MODAL NUEVO
    // =========================

    const abrirNuevoProducto = () => {

        limpiarFormulario();

        setMostrarModal(true);
    };


    // =========================
    // ABRIR MODAL EDITAR
    // =========================

    const abrirEditarProducto = (producto) => {

        setModoEdicion(true);
        setProductoEditando(producto);

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

        setCategoria(
            producto.categoria?.idCategoria
                ? producto.categoria.idCategoria
                : ""
        );

        setUnidadMedida(
            producto.unidadMedida?.idUnidadMedida
                ? producto.unidadMedida.idUnidadMedida
                : ""
        );

        setActivo(producto.activo);

        setError("");

        setMostrarModal(true);
    };


    // =========================
    // CERRAR MODAL
    // =========================

    const cerrarModal = () => {

        setMostrarModal(false);

        limpiarFormulario();
    };


    // =========================
    // GUARDAR PRODUCTO
    // =========================

    const guardarProducto = async (e) => {

        e.preventDefault();

        setError("");


        // Validaciones

        if (!nombreProducto.trim()) {

            setError("El nombre del producto es obligatorio.");
            return;
        }

        if (!categoria) {

            setError("Debe seleccionar una categoría.");
            return;
        }

        if (!unidadMedida) {

            setError("Debe seleccionar una unidad de medida.");
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

            activo: activo,

            categoria: {
                idCategoria: Number(categoria)
            },

            unidadMedida: {
                idUnidadMedida: Number(unidadMedida)
            }
        };


        try {

            if (modoEdicion) {

                await api.put(
                    `/productos/${productoEditando.idProducto}`,
                    producto
                );

            } else {

                await api.post("/productos", producto);

            }


            await cargarProductos();

            cerrarModal();


        } catch (error) {

            console.error("Error al guardar producto:", error);

            if (error.response?.data?.message) {

                setError(error.response.data.message);

            } else {

                setError("No se pudo guardar el producto.");

            }
        }
    };


    // =========================
    // ACTIVAR / DESACTIVAR
    // =========================

    const cambiarEstado = async (producto) => {

        try {

            const productoActualizado = {

                nombreProducto: producto.nombreProducto,

                descripcion: producto.descripcion,

                stockActual: producto.stockActual,

                stockMinimo: producto.stockMinimo,

                activo: !producto.activo,

                categoria: producto.categoria
                    ? {
                        idCategoria: producto.categoria.idCategoria
                    }
                    : null,

                unidadMedida: producto.unidadMedida
                    ? {
                        idUnidadMedida: producto.unidadMedida.idUnidadMedida
                    }
                    : null
            };


            await api.put(
                `/productos/${producto.idProducto}`,
                productoActualizado
            );


            await cargarProductos();


        } catch (error) {

            console.error("Error al cambiar estado:", error);

            setError("No se pudo cambiar el estado del producto.");
        }
    };


    // =========================
    // ELIMINAR
    // =========================

    const eliminarProducto = async (producto) => {

        const confirmar = window.confirm(
            `¿Está seguro que desea eliminar el producto "${producto.nombreProducto}"?`
        );


        if (!confirmar) {
            return;
        }


        try {

            await api.delete(
                `/productos/${producto.idProducto}`
            );


            await cargarProductos();


        } catch (error) {

            console.error("Error al eliminar producto:", error);

            setError("No se pudo eliminar el producto.");
        }
    };


    // =========================
    // RENDER
    // =========================

    return (

          <div className="pagina">
                    <Card title="· PRODUCCIÓN ·">
                <Button
                    className={`btn btn-${"primary"}`}
                    onClick={abrirNuevoProducto}
                >
                    + Nuevo producto
                </Button>

            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="mensaje-error">

                    {error}

                    <button
                        onClick={() => setError("")}
                    >
                        ×
                    </button>

                </div>

            )}

            {/* =========================
                TABLA
            ========================= */}

            <div className="productos-table-container">

                {cargando ? (

                    <p className="mensaje-cargando">
                        Cargando productos...
                    </p>

                ) : productos.length === 0 ? (

                    <div className="sin-productos">

                        <p>
                            No hay productos registrados.
                        </p>

                        <button
                            className="btn-nuevo"
                            onClick={abrirNuevoProducto}
                        >
                            Agregar primer producto
                        </button>

                    </div>

                ) : (

                    <table className="productos-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Descripción</th>
                                <th>Categoría</th>
                                <th>Unidad</th>
                                <th>Stock actual</th>
                                <th>Stock mínimo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.idProducto}>
                                  <td>
                                        <strong>
                                            {producto.nombreProducto}
                                        </strong>
                                    </td>

                                    <td>
                                        {producto.descripcion || "-"}
                                    </td>

                                    <td>
                                        {producto.categoria?.nombreCategoria || "-"}
                                    </td>

                                    <td>
                                        {producto.unidadMedida?.nombreUnidadMedida || "-"}
                                    </td>

                                    <td>
                                        {producto.stockActual ?? 0}
                                    </td>

                                    <td>
                                        {producto.stockMinimo ?? 0}
                                    </td>

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
                                        <div className="acciones">

                                            <button
                                                className="btn-editar"
                                                onClick={() =>
                                                    abrirEditarProducto(producto)
                                                }
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className={
                                                    producto.activo
                                                        ? "btn-desactivar"
                                                        : "btn-activar"
                                                }
                                                onClick={() =>
                                                    cambiarEstado(producto)
                                                }
                                            >
                                                {producto.activo
                                                    ? "Desactivar"
                                                    : "Activar"
                                                }
                                            </button>

                                            <button
                                                className="btn-eliminar"
                                                onClick={() =>
                                                    eliminarProducto(producto)
                                                }
                                            >
                                                Eliminar
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* =========================
                MODAL
            ========================= */}
            {mostrarModal && (

                <div className="modal-overlay">

                    <div className="modal-producto">

                        {/* HEADER MODAL */}
                        <div className="modal-header">
                            <div>
                                <h2>
                                    {modoEdicion
                                        ? "Editar producto"
                                        : "Nuevo producto"
                                    }
                                </h2>

                                <p>
                                    {modoEdicion
                                        ? "Modifique los datos del producto."
                                        : "Ingrese los datos del nuevo producto."
                                    }
                                </p>

                            </div>

                            <button
                                className="modal-cerrar"
                                onClick={cerrarModal}
                            >
                                ×
                            </button>

                        </div>

                        {/* FORMULARIO */}

                        <form onSubmit={guardarProducto}>
                            {/* NOMBRE */}
                           <div className="form-group">
                             <label>
                                    Nombre del producto *
                                </label>

                                <input
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

                                <label>
                                    Descripción
                                </label>

                                <textarea
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

                                <label>
                                    Categoría *
                                </label>

                                <select
                                    value={categoria}
                                    onChange={(e) =>
                                        setCategoria(e.target.value)
                                    }
                                >

                                    <option value="">
                                        Seleccione una categoría
                                    </option>


                                    {categorias.map((cat) => (

                                        <option
                                            key={cat.idCategoria}
                                            value={cat.idCategoria}
                                        >
                                            {cat.nombreCategoria}
                                        </option>

                                    ))}

                                </select>
                            </div>

                            {/* UNIDAD */}
                            <div className="form-group">

                                <label>
                                    Unidad de medida *
                                </label>

                                <select
                                    value={unidadMedida}
                                    onChange={(e) =>
                                        setUnidadMedida(e.target.value)
                                    }
                                >

                                    <option value="">
                                        Seleccione una unidad
                                    </option>


                                    {unidadesMedida.map((unidad) => (

                                        <option
                                            key={unidad.idUnidadMedida}
                                            value={unidad.idUnidadMedida}
                                        >
                                            {unidad.nombreUnidadMedida}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* STOCK */}

                            <div className="form-row">


                                <div className="form-group">

                                    <label>
                                        Stock actual
                                    </label>

                                    <input
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

                                    <label>
                                        Stock mínimo
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={stockMinimo}
                                        onChange={(e) =>
                                            setStockMinimo(e.target.value)
                                        }
                                    />

                                </div>

                            </div>


                            {/* ACTIVO */}

                            <div className="form-group checkbox-group">

                                <label>

                                    <input
                                        type="checkbox"
                                        checked={activo}
                                        onChange={(e) =>
                                            setActivo(e.target.checked)
                                        }
                                    />

                                    Producto activo

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

                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={cerrarModal}
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    className="btn-guardar"
                                >
                                    {modoEdicion
                                        ? "Guardar cambios"
                                        : "Crear producto"
                                    }
                                </button>

                            </div>


                        </form>

                    </div>

                </div>

            )}
        </Card>
        </div>
    );
}

export default Produccion;