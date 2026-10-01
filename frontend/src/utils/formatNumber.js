const formatoNumero = new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
});

export function formatearNumero(valor) {
    const numero = Number(valor);
    return formatoNumero.format(Number.isFinite(numero) ? numero : 0);
}
