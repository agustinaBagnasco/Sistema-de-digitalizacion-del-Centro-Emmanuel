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
      { label: "Dulce de leche", path: "/lacteos/dulceDeLeche" },
      { label: "Quark", path: "/lacteos/quark" }
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
      { label: "Ventas", path: "/administracion/Ventas" },
      { label: "Producción", path: "/administracion/Produccion" },
      { label: "Mano de obra", path: "/administracion/ManoDeObra" },
      {label: "Insumos", path: "/administracion/Insumos" },
      {label: "Productos", path: "/administracion/Productos" }
    
    ]
  }
];

