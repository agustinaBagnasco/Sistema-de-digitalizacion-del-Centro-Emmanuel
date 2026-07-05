import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, User, KeyRound, LogOut } from "lucide-react";
import logo from "../../../assets/cemm.png";
import "./Navbar.css";

export default function Navbar({ onMenuClick }) {
  const fecha = new Intl.DateTimeFormat("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Más adelante este valor vendrá del login
  const usuario = "Administrador";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  return (
    <header className="navbar">

      <div className="navbar-left">

        <button className="menu-button" onClick={onMenuClick}>
          <Menu size={22} />
        </button>

        <span className="navbar-title">
          Granja Centro Emmanuel
        </span>

      </div>

      <div className="navbar-right">

        <span className="navbar-date">
          {fecha}
        </span>

        <div className="navbar-user">
          <div className="navbar-user" ref={menuRef}>

            <button
              className="user-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="user-avatar">
                {usuario.charAt(0)}
              </div>

              <span>{usuario}</span>

              <ChevronDown size={18} />
            </button>

            {menuOpen && (
              <div className="user-menu">

                <button>
                  <KeyRound size={18} />
                  Cambiar contraseña
                </button>

                <hr />

                <button className="logout">
                  <LogOut size={18} />
                  Cerrar sesión
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </header>
  );
}