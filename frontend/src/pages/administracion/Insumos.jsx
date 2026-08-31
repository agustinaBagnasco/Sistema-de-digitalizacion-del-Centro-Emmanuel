import React from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import FormField from '../../components/ui/FormField'

function Insumos() {
  return (
    <div className="pagina">
      <Card title="· INSUMOS ·">
        <form className="form-field columns-1">
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
        </form>
        <div className="form-button-container">
          <Button
            className={`btn btn-${"primary"}`}>
            Exportar
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Insumos