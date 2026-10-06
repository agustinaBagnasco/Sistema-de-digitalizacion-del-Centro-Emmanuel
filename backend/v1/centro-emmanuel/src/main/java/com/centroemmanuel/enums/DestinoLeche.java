package com.centroemmanuel.enums;

public enum DestinoLeche {
    TERNEROS("Terneros"),
    VENTA_DIRECTA("Venta directa"),
    CONSUMO_COCINA("Cocina"),
    QUESO("Queso"),
    DULCE_DE_LECHE("Dulce de leche"),
    QUARK("Quark");

    private final String etiqueta;

    DestinoLeche(String etiqueta) {
        this.etiqueta = etiqueta;
    }

    public String getEtiqueta() {
        return etiqueta;
    }
}
