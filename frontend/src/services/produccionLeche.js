import api from "./api";

export const obtenerProduccionLeche = () => {
    return api.get("/produccion-leche");
};

export const obtenerProduccionLechePorId = (id) => {
    return api.get(`/produccion-leche/${id}`);
}

export const crearProduccionLeche = (produccionLeche) => {
    return api.post("/produccion-leche", produccionLeche);
}   

export const actualizarProduccionLeche = (id, produccionLeche) => {
    return api.put(`/produccion-leche/${id}`, produccionLeche);
}   

export const eliminarProduccionLeche = (id) => {
    return api.delete(`/produccion-leche/${id}`);
}   