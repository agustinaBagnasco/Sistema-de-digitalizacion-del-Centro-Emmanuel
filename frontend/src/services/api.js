import axios from "axios";


const api = axios.create({

    baseURL:"http://localhost:8080/api"

});

// El backend usa este encabezado para validar quién modifica o elimina elaboraciones
api.interceptors.request.use((config) => {
    try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (usuario?.idUsuario) {
            config.headers["X-Usuario-Id"] = usuario.idUsuario;
        }
    } catch {
        // sin sesión válida: el backend rechazará la operación
    }
    return config;
});

export default api;