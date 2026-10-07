const PAGE_PERMISSION_IDS = Object.freeze({
  "/administracion": 1,
  "/alimentos-procesados": 4,
  "/lacteos": 6,
  "/huerta": 7,
});

const normalizePath = (path) => path.toLowerCase().replace(/\/$/, "");

export function obtenerUsuarioActual() {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    return null;
  }
}

export function obtenerPermisoRequerido(path) {
  const normalizedPath = normalizePath(path);
  const permisoExacto = PAGE_PERMISSION_IDS[normalizedPath];
  if (permisoExacto != null) {
    return permisoExacto;
  }

  const rutaCoincidente = Object.keys(PAGE_PERMISSION_IDS)
    .filter((ruta) => normalizedPath.startsWith(`${ruta}/`))
    .sort((a, b) => b.length - a.length)[0];

  return rutaCoincidente ? PAGE_PERMISSION_IDS[rutaCoincidente] : undefined;
}

export function tienePermisoParaPagina(usuario, path) {
  const permisos = usuario?.permisos || [];
  const tieneAccesoGlobal = permisos.some((permiso) => {
    const idPermiso = typeof permiso === "object" ? permiso?.idPermiso : permiso;
    return Number(idPermiso) === 1;
  });
  if (tieneAccesoGlobal) {
    return true;
  }

  const permisoRequerido = obtenerPermisoRequerido(path);
  if (permisoRequerido == null) {
    return true;
  }

  return permisos.some((permiso) => {
    const idPermiso = typeof permiso === "object" ? permiso?.idPermiso : permiso;
    return Number(idPermiso) === permisoRequerido;
  });
}
