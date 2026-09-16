import api from "./api";

export async function obtenerElaboraciones() {
    const response = await api.get("/elaboraciones");
    return response.data;
}

export async function obtenerElaboracion(id) {
    const response = await api.get(`/elaboraciones/${id}`);
    return response.data;
}

export async function crearElaboracion(elaboracion) {
    const response = await api.post(
        "/elaboraciones",
        elaboracion
    );

    return response.data;
}

export async function actualizarElaboracion(id, elaboracion) {
    const response = await api.put(
        `/elaboraciones/${id}`,
        elaboracion
    );

    return response.data;
}

export async function eliminarElaboracion(id) {
    await api.delete(`/elaboraciones/${id}`);
}