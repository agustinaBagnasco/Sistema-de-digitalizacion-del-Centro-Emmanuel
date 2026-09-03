import { Link, useLocation } from "react-router-dom";
import '../../styles/global.css';

function Breadcrumbs() {
    const location = useLocation();

    const rutas = location.pathname
        .split("/")
        .filter(Boolean);

    const nombres = {
        admin: "Administración",
        productos: "Productos",
        produccion: "Producción",
        insumos: "Insumos",
        huerta: "Huerta",
        usuarios: "Usuarios",
        roles: "Roles",
        dashboard: "Inicio",
        cosecha: "Cosecha"
    };

    // Rutas que solo se muestran como referencia
    // y no deben ser clickeables
    const rutasNoNavegables = [
        "huerta",
        "lacteos",
        "alimentos-procesados",
        "administracion"
    ];

    return (

        <div className="breadcrumbs">

            <Link to="/">Inicio</Link>

            {rutas.map((ruta, index) => {

                const path =
                    "/" + rutas.slice(0, index + 1).join("/");

                const esUltimo =
                    index === rutas.length - 1;

                const esNoNavegable =
                    rutasNoNavegables.includes(ruta);

                return (
                    <span key={path}>

                        <span className="breadcrumb-separador">
                            /
                        </span>

                        {esUltimo || esNoNavegable ? (

                            <span
                                className={
                                    esUltimo
                                        ? "breadcrumb-actual"
                                        : ""
                                }
                            >
                                {nombres[ruta] || ruta}
                            </span>

                        ) : (

                            <Link to={path}>
                                {nombres[ruta] || ruta}
                            </Link>

                        )}

                    </span>
                );
            })}

        </div>
    );
}

export default Breadcrumbs;