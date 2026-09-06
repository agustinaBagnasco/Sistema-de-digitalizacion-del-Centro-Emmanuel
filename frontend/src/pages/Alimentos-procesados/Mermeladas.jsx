import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import FormField from '../../components/ui/FormField'
import "../../components/ui/Forms.css";
import api from "../../services/api";

export default function Mermeladas() {
  const [form, setForm] = useState({
    fecha: "",
    fruta: "",
    cantidadFrutaTotal: "",
    frutaDescartada: "",
    frutaUtilizada: "",
    cantidadAzucar: "",
    tiempoElaboracion: "",
    tiempoCoccion: "",
    cantidadFrascos1kg: "",
    cantidadFrascos420: "",
    comentario: "",
  });

  const [insumos, setInsumos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarInsumos();
  }, []);

  async function cargarInsumos() {
    try {
      const respuesta = await api.get("/productos");

      // Solo productos activos

      const insumosFrutas = respuesta.data.filter(
        producto =>
          producto.activo &&
          producto.tipo === "INSUMO" &&
          producto.categoria === "FRUTA"
      );

      setInsumos(insumosFrutas);


    } catch (error) {
      console.error("Error al cargar insumos:", error);
    }
  }

  const opcionesFrutas = insumos.map(insumo => ({
    value: insumo.idProducto,
    label: insumo.nombreProducto,
  }));


  function handleChange(e) {
  const { name, value } = e.target;

  setForm(prev => {
    const nuevoForm = {
      ...prev,
      [name]: value,
    };

    if (name === "cantidadFrutaTotal" || name === "frutaDescartada") {
      const total = parseFloat(nuevoForm.cantidadFrutaTotal) || 0;
      const descartada = parseFloat(nuevoForm.frutaDescartada) || 0;

      nuevoForm.frutaUtilizada = Math.max(total - descartada, 0);
    }

    return nuevoForm;
  });
}

  // function handleChange(e) {
  //   setForm({
  //     ...form,
  //     [e.target.name]: e.target.value,
  //   });
  // }

  function guardar(e) {
    e.preventDefault();

    setRegistros([...registros, form]);

    setForm({
      fecha: "",
      cantidad: "",
      queso: "",
      comentario: "",
    });
  }

  function guardarRegistro() {
    if (editando !== null) {
      const nuevos = [...registros];
      nuevos[editando] = form;
      setRegistros(nuevos);
      setEditando(null);
    } else {
      setRegistros([...registros, form]);
    }

    setForm({
      fecha: "",
      cantidad: "",
      queso: "",
      comentario: "",
    });
  }

  function editarRegistro(indice) {
    setForm(registros[indice]);
    setEditando(indice);
  }

  function eliminarRegistro(indice) {
    setRegistros(registros.filter((_, i) => i !== indice));
  }

  return (
    <div className="pagina">
      <Card title="· REGISTRO DE ELABORACION DE MERMELADAS ·">

        <form onSubmit={guardar} className="form-field columns-2">
          <div className="input-group">
            <label>Fecha</label>
            <Input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Fruta</label>
            <Select
              name="fruta"
              value={form.fruta}
              onChange={handleChange}
              options={opcionesFrutas}
              placeholder="Seleccione una fruta"
              required
            />
          </div>
          <div className="input-group">
            <label>Cantidad de fruta total</label>
            <Input
              type="number"
              name="cantidadFrutaTotal"
              value={form.cantidadFrutaTotal}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Fruta descartada (kgs)</label>
            <Input
              type="number"
              name="frutaDescartada"
              value={form.frutaDescartada}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Fruta utilizada (kgs)</label>
            <Input
            style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }}
              type="number"
              name="frutaUtilizada"
              value={form.frutaUtilizada}
             readOnly
            />
          </div>
          <div className="input-group">
            <label>Azucar (Kgs)</label>
            <Input
              type="number"
              name="cantidadAzucar"
              value={form.cantidadAzucar}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Tiempo de elaboracion (horas)</label>
            <Input
              type="number"
              name="tiempoElaboracion"
              value={form.tiempoElaboracion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Tiempo de cocción (horas)</label>
            <Input
              type="number"
              name="tiempoCoccion"
              value={form.tiempoCoccion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Frascos 1kg</label>
            <Input
              type="number"
              name="cantidadFrascos1kg"
              value={form.cantidadFrascos1kg}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Cantidad Frascos 420g</label>
            <Input
              type="number"
              name="cantidadFrascos420"
              value={form.cantidadFrascos420}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Comentario</label>
            <Textarea
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              placeholder="Ingrese observaciones..."
            />
          </div>
          <br />

          <div className="form-button-container">
            <Button
              type={"submit"}
              className={`btn btn-${"primary"}`}>
              Guardar
            </Button>
          </div>
        </form>

        <br />
        <hr />

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Fruta</th>
                <th>Fruta Total</th>
                <th>Fruta Descarte</th>
                <th>Fruta Utilizada </th>
                <th>Azucar</th>
                <th>Tiempo Elaboracion</th>
                <th>Tiempo Coccion</th>
                <th>Frascos 1kg</th>
                <th>Frascos 420g</th>
                <th>Comentarios</th>
              </tr>
            </thead>

            <tbody>
              {registros.map((r, i) => (
                <tr key={i}>
                  <td>{r.fecha}</td>
                  <td>{opcionesFrutas.find(o => String(o.value) === String(r.fruta))?.label}</td>
                  <td>{r.cantidadFrutaTotal}</td>
                  <td>{r.frutaDescartada}</td>
                  <td>{r.frutaUtilizada}</td>
                  <td>{r.cantidadAzucar}</td>
                  <td>{r.tiempoElaboracion}</td>
                  <td>{r.tiempoCoccion}</td>
                  <td>{r.cantidadFrascos1kg}</td>
                  <td>{r.cantidadFrascos420}</td>
                  <td>{r.comentario}</td>
                  <td>
                    <div className="table-actions">
                      <Button
                        variant="secondary"
                        onClick={() => editarRegistro(i)}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => eliminarRegistro(i)}
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
      </Card>
    </div>

  );
}




