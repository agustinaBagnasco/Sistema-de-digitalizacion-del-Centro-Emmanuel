import React from 'react';
import Card from "../components/ui/Card";
import "./Dashboard.css";

export default function Dashboard() {
    return (
        <>
    
       <div className="dashboard-grid">
            <Card  title="Productos elaborados">
                <p>Dulce de leche</p>
                <p>Quark</p>
                <p>Dulce de manzana</p>
                <p>Mermelada de naranja</p>
            </Card>
            

             <Card title="Leche producida">
                <p>1000 litros</p>
            </Card>

             <Card title="Hormas Elaboradas">
                <p>Dambo</p>
                <p>Sardo</p>
                <p>Semiduro</p>
            </Card>

             <Card title="Productos bajo stock">
                <p>Dulce de leche</p>
                <p>Quark</p>
                <p>Dulce de manzana</p>
                <p>Mermelada de naranja</p>
            </Card>

             <Card title="Insumos bajo stock">
                <p>Azucar</p>
                <p>Gas</p>
                <p>Frascos</p>
                <p>No hay insumos críticos</p>
            </Card>
            </div>
        </>
    );
}

