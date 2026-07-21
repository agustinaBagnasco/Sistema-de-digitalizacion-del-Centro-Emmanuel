import cultivos from "../../data/cultivos.json";
import { useState } from "react";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import FormField from '../../components/ui/FormField'

export default function DulceDeLeche() {
   const [form, setForm] = useState({
      fecha: "",
      litrosLeche: "",
      cantidadAzucar: "",
      cantidadBicarbonato: "",
      tiempoElaboracion: "",
      cantFrascos1kg: "",
      cantFrascos420g: "",
      comentario: "",
  });

  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);

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
      litrosLeche: "",
      cantidadAzucar: "",
      cantidadBicarbonato: "",
      tiempoElaboracion: "",
      cantFrascos1kg: "",
      cantFrascos420g: "",
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
      litrosLeche: "",
      cantidadAzucar: "",
      cantidadBicarbonato: "",
      tiempoElaboracion: "",
      cantFrascos1kg: "",
      cantFrascos420g: "",
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
      <Card title="Registro de elaboracion de dulce de leche">
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
          <label>Leche </label>
          <Input
            type="number"
            name="litrosLeche"
            value={form.litrosLeche}
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

          
          <label>Bicarbonato</label>
          <Input
            type="number"
            name="cantidadBicarbonato"
            value={form.cantidadBicarbonato}
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

          <label>Frascos 1kg</label>
          <Input
            type="number"
            name="cantFrascos1kg"
            value={form.cantFrascos1kg}
            onChange={handleChange}
            required
          />
          <br />

          <label>Frascos 420g</label>
          <Input
            type="number"
            name="cantFrascos420g"
            value={form.cantFrascos420g}
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
                <th>Leche</th>
                <th>Azucar</th>
                <th>Bicarbonato</th>
                <th>Tiempo de elaboracion</th>
                <th>Frascos 1kg</th>
                <th>Frascos 420g</th>
                <th>Comentario</th>
              </tr>
            </thead>

            <tbody>
              {registros.map((r, i) => (
                <tr key={i}>
                  <td>{r.fecha}</td>
                  <td>{r.litrosLeche}</td>
                  <td>{r.cantidadAzucar}</td>
                  <td>{r.cantidadBicarbonato}</td>
                  <td>{r.tiempoElaboracion}</td>
                  <td>{r.cantFrascos1kg}</td>
                  <td>{r.cantFrascos420g}</td>
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





