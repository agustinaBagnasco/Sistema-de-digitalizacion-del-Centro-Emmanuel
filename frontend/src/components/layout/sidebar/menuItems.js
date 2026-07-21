export const menuItems = [
  { label: "Inicio", path: "/" },
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
  { label: "Huerta", path: "/huerta" },
  { label: "Administración", 
    children: [
      { label: "Ventas", path: "/administracion/Ventas" },
      { label: "Producción", path: "/administracion/Produccion" },
      { label: "Mano de obra", path: "/administracion/ManoDeObra" },
      { label: "Stock de productos", path: "/administracion/StockDeProductos" },
      { label: "Stock de insumos", path: "/administracion/StockDeInsumos" },
      { label: "Configuración", path: "/administracion/Configuracion" }
    ]
  }
];

