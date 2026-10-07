export function mensajeError(error, mensajePorDefecto) {
    const datos = error?.response?.data;
    return datos?.mensaje
        || datos?.message
        || (typeof datos === "string" && datos.trim() ? datos : null)
        || mensajePorDefecto;
}

// Solo el responsable de la elaboración o un usuario con el permiso 1 puede modificarla o borrarla
export function puedeModificarRegistro(registro) {
    try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario?.idUsuario) return false;
        return registro?.usuario?.idUsuario === usuario.idUsuario
            || (usuario.permisos || []).includes(1);
    } catch {
        return false;
    }
}