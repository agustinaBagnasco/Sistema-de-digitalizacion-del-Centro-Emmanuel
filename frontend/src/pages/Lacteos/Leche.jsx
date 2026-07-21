import { useState } from "react";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import FormField from '../../components/ui/FormField'

export default function Leche() {
   const [form, setForm] = useState({
      fecha: "",
      litrosTerneros: "",
      ventaDirectar: "",
      consumoCocina: "",
      elaboracionQuesos: "",
      elaboracionDulceDeLeche: "",
      elaboracionQuark: "",
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
      litrosTerneros: "",
      ventaDirectar: "",
      consumoCocina: "",
      elaboracionQuesos: "",
      elaboracionDulceDeLeche: "",
      elaboracionQuark: "",
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
      litrosTerneros: "",
      ventaDirectar: "",
      consumoCocina: "",
      elaboracionQuesos: "",
      elaboracionDulceDeLeche: "",
      elaboracionQuark: "",
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
      <Card title="Registro de produccion de leche">
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
          <h3>Destino </h3>
          <hr />
          <br />
          <label>Terneros</label>
          <Input
            type="number"
            name="litrosTerneros"
            value={form.litrosTerneros}
            onChange={handleChange}
            required
          />
          <br />

          <label>Venta directa</label>
          <Input
            type="number"
            name="ventaDirecta"
            value={form.ventaDirecta}
            onChange={handleChange}
            required
          />
          <br />

          
          <label>Consumo cocina</label>
          <Input
            type="number"
            name="consumoCocina"
            value={form.consumoCocina}
            onChange={handleChange}
            required
          />
          <br />

          <label>Queso</label>
          <Input
            type="number"
            name="elaboracionQuesos"
            value={form.elaboracionQuesos}
            onChange={handleChange}
            required
          />
          <br />

          <label>Dulce de leche</label>
          <Input
            type="number"
            name="elaboracionDulceDeLeche"
            value={form.elaboracionDulceDeLeche}
            onChange={handleChange}
            required
          />
          <br />

          <label>Quark</label>
          <Input
            type="number"
            name="elaboracionQuark"
            value={form.elaboracionQuark}
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
                <th>Terneros</th>
                <th>Venta directa</th>
                <th>Consumo cocina</th>
                <th>Queso</th>
                <th>Dulce de leche</th>
                <th>Quark</th>
                <th>Comentario</th>
              </tr>
            </thead>

            <tbody>
              {registros.map((r, i) => (
                <tr key={i}>
                  <td>{r.fecha}</td>
                  <td>{r.litrosTerneros}</td>
                  <td>{r.ventaDirecta}</td>
                  <td>{r.consumoCocina}</td>
                  <td>{r.elaboracionQuesos}</td>
                  <td>{r.elaboracionDulceDeLeche}</td>
                  <td>{r.elaboracionQuark}</td>
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





