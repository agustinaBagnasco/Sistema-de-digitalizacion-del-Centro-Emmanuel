import { NavLink } from "react-router-dom";
import { menuItems } from "./menuItems";
import "./Sidebar.css";
import logo from "../../../assets/cemm.png";
import { useState } from "react";


export default function Sidebar({ open, onClose }) {

  const [openMenu, setOpenMenu] = useState(null);


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
  {menuItems.map((item, index) => (
    <div key={index}>

      {item.children ? (
        <>
          <button
            className="menu-item submenu-button"
            onClick={() =>
              setOpenMenu(openMenu === index ? null : index)
            }
          >
            <span>{item.label}</span>
            <span>{openMenu === index ? "▾" : "▸"}</span>
          </button>

          {openMenu === index && (
            <div className="submenu">
              {item.children.map((sub) => (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    isActive
                      ? "submenu-item active"
                      : "submenu-item"
                  }
                >
                  {sub.label}
                </NavLink>
              ))}
            </div>
          )}
        </>
      ) : (
        <NavLink
          to={item.path}
          onClick={onClose}
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          {item.label}
        </NavLink>
      )}

    </div>
  ))}
</nav>
        </aside>
    </>
  );
}