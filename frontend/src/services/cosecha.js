import api from "./api";

export const obtenerCosechas = () => {
    return api.get("/cosechas");
};

export const obtenerCosechaPorId = (id) => {
    return api.get(`/cosechas/${id}`);
};

export const crearCosecha = (cosecha) => {
    return api.post("/cosechas", cosecha);
};

export const actualizarCosecha = (id, cosecha) => {
    return api.put(`/cosechas/${id}`, cosecha);
};

export const eliminarCosecha = (id) => {
    return api.delete(`/cosechas/${id}`);
};
