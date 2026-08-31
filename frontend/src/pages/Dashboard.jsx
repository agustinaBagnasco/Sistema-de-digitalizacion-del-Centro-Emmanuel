import React from 'react';
import Card from "../components/ui/Card";
import "./Dashboard.css";

export default function Dashboard() {

    const fechaActual = new Date();

    const mesActual = fechaActual.toLocaleDateString("es-UY", {
        month: "long",
    });

    const añoActual = fechaActual.getFullYear();


    return (
        <>
            <div className="pagina">

                <Card title={`· ${mesActual.toUpperCase()} ${añoActual} ·`}>

                    <div className="dashboard-grid">
                        <Card title="Productos elaborados">
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
                        <Card title="Proximas elaboraciones">
                            <p>Dulce de leche: Lunes 31/8/26</p>
                            <p>Quark</p>
                        </Card>
                    </div>
                </Card>
            </div>
        </>
    );
}

