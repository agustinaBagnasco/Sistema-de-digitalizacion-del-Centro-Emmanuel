import { NavLink } from "react-router-dom";
import { menuItems } from "./menuItems";
import "./Sidebar.css";
import logo from "../../../assets/cemm.png";

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${open ? "open" : ""}`}>

        <div className="sidebar-header">
            <img
        src={logo}
        alt="Centro Emmanuel"
        className="sidebar-logo"
          />
          <p>Sistema de Gestión</p>
        </div>

        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

      </aside>
    </>
  );
}