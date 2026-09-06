import api from "./api";

export const obtenerProductos = () => {
    return api.get("/productos");
};

export const obtenerProductoPorId = (id) => {
    return api.get(`/productos/${id}`);
};

export const crearProducto = (producto) => {
    return api.post("/productos", producto);
};

export const actualizarProducto = (id, producto) => {
    return api.put(`/productos/${id}`, producto);
};

export const eliminarProducto = (id) => {
    return api.delete(`/productos/${id}`);
};


// ========================= ENUMS =========================

export const tipos = [
    { value: "PRODUCTO", label: "Producto" },
    { value: "INSUMO", label: "Insumo" }
];

export const categorias = [
    { value: "LECHE", label: "Leche" },
    { value: "MOLIENDA", label: "Molienda" },
    { value: "MERMELADA", label: "Mermelada" },
    { value: "DULCEDELECHE", label: "Dulce de leche" },
    { value: "QUESO", label: "Queso" },
    { value: "FRUTASYHORTALIZAS", label: "Frutas y hortalizas" },
    { value: "FRUTA", label: "Fruta" }, 
    { value: "GRANOS", label: "Granos" },
    { value: "OTROS", label: "Otros" }
];

export const unidadesMedida = [
    { value: "KG", label: "Kilogramos (KG)" },
    { value: "LT", label: "Litros (LT)" },
    { value: "MG", label: "Miligramos (MG)" },
    { value: "ML", label: "Mililitros (ML)" },
    { value: "UN", label: "Unidades (UN)" },
    { value: "ATADO", label: "Atados (ATADO)" }
];