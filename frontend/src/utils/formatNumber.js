const formatoNumero = new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
});

export function formatearNumero(valor) {
    const numero = Number(valor);
    return formatoNumero.format(Number.isFinite(numero) ? numero : 0);
}

export function etiquetaInsumo(producto) {
    const nombre = producto?.nombreProducto || "";
    const critico = Number(producto?.stockActual) <= Number(producto?.stockMinimo);
    if (!critico) return nombre;
    return `${nombre} (${formatearNumero(producto.stockActual)} ${producto.unidadMedida || ""} disponible)`.replace(" )", ")");
}
