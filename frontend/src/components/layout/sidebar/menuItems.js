export const menuItems = [
  { label: "Alimentos Procesados",
    children: [
      { label: "Mermeladas", path: "/alimentos-procesados/mermeladas" },
      { label: "Moliendas", path: "/alimentos-procesados/molienda" }
    ]
  },
  { label: "Lacteos", 
    children: [
      { label: "Leche", path: "/lacteos/Leche" },
      { label: "Quesos", path: "/lacteos/quesos" },
      { label: "Dulce de leche", path: "/lacteos/dulceDeLeche" }
    ]
  },
  { label: "Huerta", 
    children: [
      { label: "Cosecha", path: "/huerta/cosecha" }
    ]
  },
  { label: "Administración", 
    children: [
      { label: "Usuarios", path: "/administracion/usuarios" },
      { label: "Permisos", path: "/administracion/permisos" },
      { label: "Ventas", path: "/administracion/Ventas" },
      { label: "Movimientos", path: "/administracion/Movimientos" },
      { label: "Mano de obra", path: "/administracion/ManoDeObra" },
      {label: "Productos/Insumos", path: "/administracion/ProductoInsumo" },
      { label: "Reportes", path: "/administracion/reportes" }
    
    ]
  }
];
