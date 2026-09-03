import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import "../../styles/global.css";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";

function Insumos() {

  const [insumos, setInsumos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [insumoEditando, setInsumoEditando] = useState(null);

  const [nombreInsumo, setNombreInsumo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [activo, setActivo] = useState(true);

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);


  // ==========================================================
  // CARGAR DATOS
  // ==========================================================

  useEffect(() => {
    cargarInsumos();
    cargarCategorias();
    cargarUnidadesMedida();
  }, []);


  const cargarInsumos = async () => {

    try {

      setCargando(true);
      setError("");

      const respuesta = await api.get("/productos");

      // Solo mostramos los que son INSUMOS
      const datosInsumos = respuesta.data.filter(
        (item) => item.tipo === "INSUMO"
      );

      setInsumos(datosInsumos);

    } catch (error) {

      console.error("Error al cargar insumos:", error);
      setError("No se pudieron cargar los insumos.");

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


  // ==========================================================
  // LIMPIAR FORMULARIO
  // ==========================================================

  const limpiarFormulario = () => {

    setNombreInsumo("");
    setDescripcion("");
    setStockActual("");
    setStockMinimo("");
    setCategoria("");
    setUnidadMedida("");
    setActivo(true);

    setInsumoEditando(null);
    setModoEdicion(false);

    setError("");
  };


  // ==========================================================
  // NUEVO INSUMO
  // ==========================================================

  const abrirNuevoInsumo = () => {

    limpiarFormulario();
    setMostrarModal(true);

  };


  // ==========================================================
  // EDITAR INSUMO
  // ==========================================================

  const abrirEditarInsumo = (insumo) => {

    setModoEdicion(true);
    setInsumoEditando(insumo);

    setNombreInsumo(insumo.nombreProducto || "");
    setDescripcion(insumo.descripcion || "");

    setStockActual(
      insumo.stockActual !== null &&
        insumo.stockActual !== undefined
        ? insumo.stockActual
        : ""
    );

    setStockMinimo(
      insumo.stockMinimo !== null &&
        insumo.stockMinimo !== undefined
        ? insumo.stockMinimo
        : ""
    );

    setCategoria(
      insumo.categoria?.idCategoria
        ? insumo.categoria.idCategoria
        : ""
    );

    setUnidadMedida(
      insumo.unidadMedida?.idUnidadMedida
        ? insumo.unidadMedida.idUnidadMedida
        : ""
    );

    setActivo(insumo.activo);

    setError("");
    setMostrarModal(true);
  };


  // ==========================================================
  // CERRAR MODAL
  // ==========================================================

  const cerrarModal = () => {

    setMostrarModal(false);
    limpiarFormulario();

  };


  // ==========================================================
  // GUARDAR INSUMO
  // ==========================================================

  const guardarInsumo = async (e) => {

    e.preventDefault();
    setError("");


    // Validaciones

    if (!nombreInsumo.trim()) {

      setError("El nombre del insumo es obligatorio.");
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


    const insumo = {

      nombreProducto: nombreInsumo.trim(),

      descripcion: descripcion.trim(),

      stockActual:
        stockActual === ""
          ? 0
          : Number(stockActual),

      stockMinimo:
        stockMinimo === ""
          ? 0
          : Number(stockMinimo),

      activo: activo,

      // IMPORTANTE
      tipo: "INSUMO",

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
          `/productos/${insumoEditando.idProducto}`,
          insumo
        );

      } else {

        await api.post(
          "/productos",
          insumo
        );

      }

      await cargarInsumos();

      cerrarModal();

    } catch (error) {

      console.error("Error al guardar insumo:", error);

      if (error.response?.data?.message) {

        setError(error.response.data.message);

      } else {

        setError("No se pudo guardar el insumo.");

      }
    }
  };


  // ==========================================================
  // ACTIVAR / DESACTIVAR
  // ==========================================================

  const cambiarEstado = async (insumo) => {

    try {

      const insumoActualizado = {

        nombreProducto: insumo.nombreProducto,

        descripcion: insumo.descripcion,

        stockActual: insumo.stockActual,

        stockMinimo: insumo.stockMinimo,

        activo: !insumo.activo,

        tipo: "INSUMO",

        categoria: insumo.categoria
          ? {
            idCategoria: insumo.categoria.idCategoria
          }
          : null,

        unidadMedida: insumo.unidadMedida
          ? {
            idUnidadMedida: insumo.unidadMedida.idUnidadMedida
          }
          : null
      };


      await api.put(
        `/productos/${insumo.idProducto}`,
        insumoActualizado
      );

      await cargarInsumos();

    } catch (error) {

      console.error(
        "Error al cambiar estado:",
        error
      );

      setError(
        "No se pudo cambiar el estado del insumo."
      );
    }
  };


  // ==========================================================
  // ELIMINAR
  // ==========================================================

  const eliminarInsumo = async (insumo) => {

    const confirmar = window.confirm(
      `¿Está seguro que desea eliminar el insumo "${insumo.nombreProducto}"?`
    );

    if (!confirmar) {
      return;
    }


    try {

      await api.delete(
        `/productos/${insumo.idProducto}`
      );

      await cargarInsumos();

    } catch (error) {

      console.error(
        "Error al eliminar insumo:",
        error
      );

      setError(
        "No se pudo eliminar el insumo."
      );
    }
  };


  // ==========================================================
  // VISTA
  // ==========================================================

  return (

    <div className="pagina">

      <Card title="· INSUMOS ·">      
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Insumo</th>
                <th>Entradas</th>
                <th>Salidas</th>
                <th>Stock actual</th>
                <th>Minimo</th>
                <th>Estado</th>
                <th>Ver movimientos</th>
              </tr>
            </thead>
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

export default Insumos;