// import { useState, useRef, useEffect } from "react";
// import { Menu, ChevronDown, User, KeyRound, LogOut } from "lucide-react";
// import logo from "../../../assets/logoCe.png";
// import "./Navbar.css";
// import { useNavigate } from "react-router-dom";

// export default function Navbar({ onMenuClick }) {
//   const fecha = new Intl.DateTimeFormat("es-UY", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   }).format(new Date());

//   //const nombre = localStorage.getItem("usuario") || "Invitado";

//   const usuarioGuardado = localStorage.getItem("usuario");

// const usuario = usuarioGuardado
//     ? JSON.parse(usuarioGuardado).nombre
//     : "Invitado";

//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);

//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const navigate = useNavigate();

//   const cerrarSesion = () => {
//     localStorage.removeItem("usuario");

//     navigate("/login", { replace: true });
//   };


//   return (
//     <header className="navbar">

//       <div className="navbar-left">

//         <button className="menu-button" onClick={onMenuClick}>
//           <Menu size={22} />
//         </button>

//         <span className="navbar-title">
//           Granja Centro Emmanuel
//         </span>

//       </div>

//       <div className="navbar-right">

//         <span className="navbar-date">
//           {fecha}
//         </span>

//         <div className="navbar-user">
//           <div className="navbar-user" ref={menuRef}>

//             <button
//               className="user-button"
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               <div className="user-avatar">
//                 {usuario.charAt(0)}
//               </div>

//               <span>{usuario}</span>

//               <ChevronDown size={18} />
//             </button>

//             {menuOpen && (
//               <div className="user-menu">
//                 <hr />

//                 <button className="logout" onClick={cerrarSesion}>
//                   <LogOut size={18} />
//                   Cerrar sesión
//                 </button>
//               </div>
//             )}

//           </div>

//         </div>

//       </div>

//     </header>
//   );
// }


import { useState, useRef, useEffect } from "react";
import {
  Menu,
  ChevronDown,
  LogOut,
  Bell
} from "lucide-react";

import logo from "../../../assets/logoCe.png";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { formatearNumero } from "../../../utils/formatNumber";

export default function Navbar({ onMenuClick }) {

  const fecha = new Intl.DateTimeFormat("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const usuarioGuardado = localStorage.getItem("usuario");

  const usuario = usuarioGuardado
    ? JSON.parse(usuarioGuardado).nombre
    : "Invitado";

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false);
  const [alertasStock, setAlertasStock] = useState([]);
  const [errorAlertas, setErrorAlertas] = useState(false);

  const menuRef = useRef(null);
  const notificacionesRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    let activo = true;
    const horasAlertas = new Map();

    async function cargarAlertasStock() {
      try {
        const respuesta = await api.get("/stock/alertas-stock-minimo");
        if (activo) {
          const alertasActivas = respuesta.data
            .filter((producto) => producto.activo)
            .map((producto) => {
              const horaDeteccion = horasAlertas.get(producto.idProducto) || new Date();
              horasAlertas.set(producto.idProducto, horaDeteccion);
              return { ...producto, horaDeteccion };
            });

          alertasActivas.sort((a, b) => {
            const nivel = (p) => Number(p.stockMinimo) > 0 ? Number(p.stockActual) / Number(p.stockMinimo) : 0;
            return nivel(a) - nivel(b);
          });
          const firma = (lista) => lista
            .map((p) => `${p.idProducto}:${p.stockActual}:${p.stockMinimo}`).join("|");
          setErrorAlertas(false);
          setAlertasStock((anteriores) =>
            firma(anteriores) === firma(alertasActivas) ? anteriores : alertasActivas);
        }
      } catch (errorCarga) {
        console.error("Error al cargar alertas de stock:", errorCarga);
        if (activo) setErrorAlertas(true);
      }
    }

    function cargarSiVisible() {
      if (document.visibilityState === "visible") void cargarAlertasStock();
    }

    void cargarAlertasStock();
    const intervalo = window.setInterval(cargarSiVisible, 60000);
    document.addEventListener("visibilitychange", cargarSiVisible);
    window.addEventListener("alertas-stock:actualizar", cargarAlertasStock);

    return () => {
      activo = false;
      window.clearInterval(intervalo);
      document.removeEventListener("visibilitychange", cargarSiVisible);
      window.removeEventListener("alertas-stock:actualizar", cargarAlertasStock);
    };
  }, []);

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        notificacionesRef.current && !notificacionesRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
        setNotificacionesAbiertas(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  const cerrarSesion = () => {

    localStorage.removeItem("usuario");

    navigate("/login", {
      replace: true
    });

  };

  const productosBajoStock = alertasStock.filter((producto) => producto.tipo === "PRODUCTO");
  const insumosBajoStock = alertasStock.filter((producto) => producto.tipo === "INSUMO");

  const mostrarHora = (fecha) => new Intl.DateTimeFormat("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);

  const abrirNotificaciones = () => {
    if (!notificacionesAbiertas) window.dispatchEvent(new Event("alertas-stock:actualizar"));
    setNotificacionesAbiertas((abiertas) => !abiertas);
    setMenuOpen(false);
  };

  return (

    <header className="navbar">

      <div className="navbar-left">

        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>

        <img
          src={logo}
          alt="Centro Emmanuel"
          className="navbar-logo"
        />

        <span className="navbar-title">
          Granja Centro Emmanuel
        </span>

      </div>


      <div className="navbar-right">

        <span className="navbar-date">
          {fecha}
        </span>

        <div className="navbar-notifications" ref={notificacionesRef}>
          <button
            className={`notification-button${alertasStock.length ? " has-alerts" : ""}`}
            onClick={abrirNotificaciones}
            aria-label={`Ver alertas de stock${alertasStock.length ? ` (${alertasStock.length})` : ""}`}
            aria-expanded={notificacionesAbiertas}
          >
            <Bell size={20} />
            {alertasStock.length > 0 && <span className="notification-count">{alertasStock.length}</span>}
          </button>

          {notificacionesAbiertas && (
            <div className="notification-menu">
              <div className="notification-header">
                <strong>Alertas de stock</strong>
                <span>{alertasStock.length}</span>
              </div>

              {errorAlertas ? (
                <p className="notification-empty">No se pudieron cargar las alertas.</p>
              ) : alertasStock.length === 0 ? (
                <p className="notification-empty">No hay productos ni insumos bajo stock.</p>
              ) : (
                <div className="notification-list">
                  {[{ titulo: "Productos", elementos: productosBajoStock, ruta: "/administracion/Movimientos" }, { titulo: "Insumos", elementos: insumosBajoStock, ruta: "/administracion/Movimientos" }]
                    .filter((grupo) => grupo.elementos.length > 0)
                    .map((grupo) => (
                      <div className="notification-group" key={grupo.titulo}>
                        <span className="notification-group-title">{grupo.titulo}</span>
                        {grupo.elementos.map((producto) => (
                          <button
                            className="notification-item"
                            key={producto.idProducto}
                            onClick={() => navigate(grupo.ruta)}
                          >
                            <span>{producto.nombreProducto}</span>
                            <small>{formatearNumero(producto.stockActual)} / {formatearNumero(producto.stockMinimo)} {producto.unidadMedida || ""}</small>
                            <time dateTime={producto.horaDeteccion.toISOString()}>Detectada a las {mostrarHora(producto.horaDeteccion)}</time>
                          </button>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="navbar-user"
          ref={menuRef}
        >

          <button
            className="user-button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Abrir menú de usuario"
          >

            <div className="user-avatar">
              {usuario.charAt(0).toUpperCase()}
            </div>

            <span>{usuario}</span>

            <ChevronDown size={18} />

          </button>


          {menuOpen && (

            <div className="user-menu">

              <button
                className="logout"
                onClick={cerrarSesion}
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );
}