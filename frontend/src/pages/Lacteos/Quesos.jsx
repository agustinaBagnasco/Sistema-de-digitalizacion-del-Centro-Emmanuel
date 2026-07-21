import { useState } from "react";
import quesos from "../../data/quesos.json";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import FormField from '../../components/ui/FormField'

export default function Quesos() {
  const [form, setForm] = useState({
    fecha: "",
    cantidad: "",
    queso: "",
    comentario: "",
  });

  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);

  const opcionesQuesos = quesos.map(queso => ({
    value: queso.id,
    label: queso.nombre,
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
      <Card title="Registro de elaboracion de quesos">
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
          <label>Tipo de queso</label>
          <Select
            name="queso"
            value={form.queso}
            onChange={handleChange}
            options={opcionesQuesos}
            placeholder="Seleccione un tipo de queso"
          />
          <br />

          <label>Cantidad</label>
          <Input
            type="number"
            name="cantidad"
            value={form.cantidad}
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
                <th>Cantidad</th>
                <th>Tipo de queso</th>
                <th>Comentario</th>
              </tr>
            </thead>

            <tbody>
              {registros.map((r, i) => (
                <tr key={i}>
                  <td>{r.fecha}</td>
                  <td>{r.cantidad}</td>
                  <td>{opcionesQuesos.find(o => String(o.value) === String(r.queso))?.label}</td>
                  <td>{r.comentario}</td>Q
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




