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
import FormField from "../../components/ui/FormField";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import "../../styles/global.css"


function Productos() {
    const [productos, setProductos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);

    const [nombreProducto, setNombreProducto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [stockActual, setStockActual] = useState("");
    const [stockMinimo, setStockMinimo] = useState("");
    const [activo, setActivo] = useState(true);
    const [tipo, setTipo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [unidadMedida, setUnidadMedida] = useState("");

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    // ========================= CARGAR DATOS =========================

    useEffect(() => {
        cargarProductos();
    }, []);

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


    // ========================= LIMPIAR FORMULARIO =========================

    const limpiarFormulario = () => {

        setNombreProducto("");
        setDescripcion("");
        setStockActual("");
        setStockMinimo("");
        setTipo("");
        setCategoria("");
        setUnidadMedida("");
        setActivo(true);

        setProductoEditando(null);
        setModoEdicion(false);

        setError("");
    };


    // ========================= ABRIR MODAL NUEVO =========================

    const abrirNuevoProducto = () => {
        limpiarFormulario();
        setMostrarModal(true);
    };


    // ========================= ABRIR MODAL EDITAR =========================

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
        setTipo(producto.tipo || "");

        setCategoria(producto.categoria || "");

        setUnidadMedida(producto.unidadMedida || "");


        setActivo(producto.activo);

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

        // Validaciones

        if (!nombreProducto.trim()) {

            setError("El nombre del producto es obligatorio.");
            return;
        }
        if (!tipo) {
            setError("Debe seleccionar un tipo.");
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

            tipo: tipo,
            categoria: categoria,
            unidadMedida: unidadMedida,

        };

        try {
            if (modoEdicion) {

                await actualizarProducto(
                    productoEditando.idProducto,
                    producto)

            } else {

                await crearProducto(producto);

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


    // ========================= ACTIVAR / DESACTIVAR =========================

    const cambiarEstado = async (producto) => {

        try {
            const productoActualizado = {

                nombreProducto: producto.nombreProducto,
                descripcion: producto.descripcion,
                stockActual: producto.stockActual,
                stockMinimo: producto.stockMinimo,
                activo: !producto.activo,
                tipo: producto.tipo,
                categoria: producto.categoria,
                unidadMedida: producto.unidadMedida
            };

            await actualizarProducto(
                producto.idProducto,
                productoActualizado)

            await cargarProductos();

        } catch (error) {

            console.error("Error al cambiar estado:", error);
            setError("No se pudo cambiar el estado del producto.");
        }
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
            setError("No se pudo eliminar el producto.");
        }
    };
    console.log("TIPOS:", tipos);
    console.log("CATEGORIAS:", categorias);
    console.log("UNIDADES:", unidadesMedida);

    return (


        <div className="pagina">
            <Card title="· PRODUCTOS | INSUMOS ·">
                <Button
                    className={`btn btn-${"primary"}`}
                    onClick={abrirNuevoProducto}
                >
                    + Nuevo producto
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

                <div className="productos-table-container">
                    {cargando ? (
                        <p className="mensaje-cargando">
                            Cargando productos...
                        </p>
                    ) : productos.length === 0 ? (
                        <div>
                            <p>No hay productos registrados </p>
                            <Button
                                className={`btn btn-${"primary"}`}
                                onClick={abrirNuevoProducto}
                            >
                                Agregar primer producto
                            </Button>
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
                                            <strong>{producto.nombreProducto}</strong>
                                        </td>

                                        <td>{producto.descripcion || "-"}</td>
                                        <td>{producto.tipo || "-"}</td>
                                        <td>{producto.categoria || "-"}</td>

                                        <td>{producto.unidadMedida || "-"}</td>


                                        <td>{producto.stockActual ?? 0}</td>

                                        <td>{producto.stockMinimo ?? 0}</td>

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
                                                        eliminarProductoTabla(producto)
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
                                            ? "Editar producto"
                                            : "Nuevo producto"
                                        }
                                    </h2>
                                    <hr />
                                    <p>
                                        {modoEdicion
                                            ? "Modifique los datos del producto."
                                            : "Ingrese los datos del nuevo producto."
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
                            <form onSubmit={guardarProducto} className="form-field columns-2">
                                {/* NOMBRE */}
                                <div className="form-group">
                                    <label>
                                        Nombre del producto *
                                    </label>
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

                                <div className="form-group">
                                    <label>Tipo *</label>

                                    <Select
                                        value={tipo}
                                        onChange={(e) => setTipo(e.target.value)}
                                        options={tipos}
                                        placeholder="Seleccione un tipo"
                                    />

                                </div>

                                {/* CATEGORÍA */}
                                <div className="form-group">
                                    <label>Categoría *</label>

                                    <Select
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                        options={categorias}
                                        placeholder="Seleccione una categoría"
                                    />
                                </div>

                                {/* UNIDAD */}
                                <div className="form-group">
                                    <label>Unidad de medida *</label>
                                    <Select
                                        value={unidadMedida}
                                        onChange={(e) => setUnidadMedida(e.target.value)}
                                        options={unidadesMedida}
                                        placeholder="Seleccione una unidad"
                                    />
                                </div>

                                {/* STOCK */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Stock actual</label>
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
                                            : "Crear producto"
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