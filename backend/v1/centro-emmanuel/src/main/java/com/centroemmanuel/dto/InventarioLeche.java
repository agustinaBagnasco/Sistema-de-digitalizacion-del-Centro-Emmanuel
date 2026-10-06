package com.centroemmanuel.dto;

import java.math.BigDecimal;

public record InventarioLeche(
        String destino,
        String etiqueta,
        BigDecimal asignado,
        BigDecimal utilizado,
        BigDecimal disponible
) {
}
