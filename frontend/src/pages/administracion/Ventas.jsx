import React from 'react'
import FormField from '../../components/ui/FormField'
import Card from '../../components/ui/Card'

function Ventas() {
  return (
   <div className="pagina">
         <Card title="· VENTAS ·">
          <button className='btn btn-primary' title='Cargar archivo de ventas' >Importar ventas</button>
          <br />
           <br />
          <small> (Cargar archivos .xlsx)</small>
           <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Producto</th>
                          <th>Precio unitario</th>
                           <th>Importe</th>
                          <th>Unidades vendidas</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
          
                      {/* <tbody>
                        {registros.map((r, i) => (
                          <tr key={i}>
                            <td>{r.fecha}</td>
                            <td>{r.producto}</td>
                            <td>{r.precioUnitario}</td>
                            <td>{r.importe}</td>
                            <td>{r.unidadesVendidas}</td>
                            <td>
                      
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
                      </tbody> */}
                    </table>
                  </div>

         </Card>
    </div>
    
  )
}

export default Ventas