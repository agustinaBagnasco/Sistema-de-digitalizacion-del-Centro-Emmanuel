package com.centroemmanuel.dto;

import java.math.BigDecimal;
import java.util.List;

public record InventarioLecheResponse(
        BigDecimal litrosTotales,
        BigDecimal litrosAsignados,
        BigDecimal litrosUtilizados,
        List<InventarioLeche> areas
) {
}
