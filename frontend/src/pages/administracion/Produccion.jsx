import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import "../../styles/global.css"
import FormField from "../../components/ui/FormField";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";

function Produccion() {
    const [productos, setProductos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);

    const [nombreProducto, setNombreProducto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [stockActual, setStockActual] = useState("");
    const [stockMinimo, setStockMinimo] = useState("");
    const [activo, setActivo] = useState(true);

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const categorias = [
        { value: "LECHE", label: "Leche" },
        { value: "HARINA", label: "Harina" },
        { value: "MERMELADA", label: "Mermelada" },
        { value: "DULCEDELECHE", label: "Dulce de leche" },
        { value: "QUESO", label: "Queso" },
        { value: "COSECHA", label: "Cosecha" }
    ];

    const unidadesMedida = [
        { value: "KG", label: "Kilogramos (KG)" },
        { value: "LT", label: "Litros (LT)" },
        { value: "MG", label: "Miligramos (MG)" },
        { value: "ML", label: "Mililitros (ML)" }
    ];

    const tipos = [
        { value: "PRODUCTO", label: "Producto" },
        { value: "INSUMO", label: "Insumo" }
    ];

    // ========================= CARGAR DATOS =========================

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

    // const cerrarModal = () => {
    //     setMostrarModal(false);
    //     limpiarFormulario();
    // };

    // ========================= GUARDAR PRODUCTO =========================

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

            tipo: tipo,
            categoria: categoria,
            unidadMedida: unidadMedida,

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


    // ========================= ACTIVAR / DESACTIVAR =========================

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

    // ========================= ELIMINAR =========================

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

    return (

        <div className="pagina">
            <Card title="· PRODUCCIÓN ·">

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Entradas</th>
                                <th>Salidas</th>
                                <th>Stock actual</th>
                                <th>Minimo</th>
                                <th>Estado</th>
                                <th>Ver movimientos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.idProducto}>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.entradas}</td>
                                    <td>{producto.salidas}</td>
                                    <td>{producto.stockActual}</td>
                                    <td>{producto.minimo}</td>
                                    <td>{producto.estado}</td>
                                    <td>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => verMovimientos(producto.idProducto)}
                                        >
                                            Ver movimientos
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

                <div className="form-button-container">
                    <Button
                        className={`btn btn-${"primary"}`}>
                        Exportar
                    </Button>
                </div>

            </Card>
        </div>
    );
}

export default Produccion;