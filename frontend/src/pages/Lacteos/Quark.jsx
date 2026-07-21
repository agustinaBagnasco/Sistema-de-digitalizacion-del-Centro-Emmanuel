import { useState } from "react";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import FormField from '../../components/ui/FormField'

export default function Quark() {
  const [form, setForm] = useState({
    fecha: "",
    litrosLeche: "",
    cantFrascos: "",
    tiempoElaboracion: "",
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
      cantFrascos: "",
      tiempoElaboracion: "",
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
      cantFrascos: "",
      tiempoElaboracion: "",
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
      <Card title="Registro de elaboracion de queso quark">
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

          <label>Leche</label>
          <Input
            type="number"
            name="litrosLeche"
            value={form.litrosLeche}
            onChange={handleChange}
            required
          />
          <br />

          <label>Cantidad de Frascos</label>
          <Input
            type="number"
            name="cantFrascos"
            value={form.cantFrascos}
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
                <th>Cantidad de Frascos</th>
                <th>Tiempo de elaboracion</th>
                <th>Comentario</th>
              </tr>
            </thead>

            <tbody>
              {registros.map((r, i) => (
                <tr key={i}>
                  <td>{r.fecha}</td>
                  <td>{r.litrosLeche}</td>
                  <td>{r.cantFrascos}</td>
                  <td>{r.tiempoElaboracion}</td>
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





