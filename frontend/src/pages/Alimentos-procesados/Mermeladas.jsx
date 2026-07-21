import { useState } from "react";
import frutas from "../../data/frutas.json";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import FormField from '../../components/ui/FormField'

export default function Mermeladas() {
  const [form, setForm] = useState({
    fecha: "",
    cantidad: "",
    queso: "",
    comentario: "",
  });

  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);

  const opcionesFrutas = frutas.map(fruta => ({
    value: fruta.id,
    label: fruta.nombre,
  }));

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

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
      <Card title="Registro de elaboracion de mermeladas">
        <form onSubmit={guardar} className="formulario">

          <label>Fecha</label>
          <Input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />
          <br />
          <label>Fruta</label>
          <Select
            name="fruta"
            value={form.fruta}
            onChange={handleChange}
            options={opcionesFrutas}
            placeholder="Seleccione una fruta"
          />
          <br />

          <label>Cantidad de fruta total</label>
          <Input
            type="number"
            name="cantidadFrutaTotal"
            value={form.cantidadFrutaTotal}
            onChange={handleChange}
            required
          />
          <br />
          <label>Fruta descartada</label>
          <Input
            type="number"
            name="frutaDescartada"
            value={form.frutaDescartada}
            onChange={handleChange}
            required
          />
          <br />
          <label>Fruta utilizada</label>
          <Input
            type="number"
            name="frutaUtilizada"
            value={form.frutaUtilizada}
            onChange={handleChange}
            required
          />
          <br />
          <label>Azucar</label>
          <Input
            type="number"
            name="cantidadAzucar"
            value={form.cantidadAzucar}
            onChange={handleChange}
            required
          />
          <br />
          <label>Tiempo de elaboracion</label>
          <Input
            type="number"
            name="tiempoElaboracion"
            value={form.tiempoElaboracion}
            onChange={handleChange}
            required
          />
          <br />
          <label>Tiempo de coccion</label>
          <Input
            type="number"
            name="tiempoCoccion"
            value={form.tiempoCoccion}
            onChange={handleChange}
            required
          />
          <br />
          <label>Frascos 1kg</label>
          <Input
            type="number"
            name="cantidadFrascos1kg"
            value={form.cantidadFrascos1kg}
            onChange={handleChange}
            required
          />
          <br />
          <label>Cantidad Frascos 420g</label>
          <Input
            type="number"
            name="cantidadFrascos420"
            value={form.cantidadFrascos420}
            onChange={handleChange}
            required
          />
          <br />
          <label>Comentario</label>
          <Textarea
            name="comentario"
            value={form.comentario}
            onChange={handleChange}
            placeholder="Ingrese observaciones..."
          />
          <br />

          <Button
            type={"submit"}
            className={`btn btn-${"primary"}`}>
            Guardar
          </Button>

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
                <th>Fruta Utilizada</th>
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




