import React from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import FormField from '../../components/ui/FormField'
import productos from '../../data/productos.json'


function StockDeProductos() {
  return (
    <div className="pagina">
      <Card title="· CONTROL DE STOCKS ·">
        <form className="form-field columns-1">
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
              </table>
              <div className="form-button-container">
                        <Button
                          className={`btn btn-${"primary"}`}>
                          Exportar
                        </Button>
                      </div>
               </div>
            </form>        
         </Card>
         </div>
        )
}

        export default StockDeProductos