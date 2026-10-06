package com.centroemmanuel.dto;

import java.time.LocalDateTime;

public record ReporteMensualResumen(
        String periodo,
        LocalDateTime fechaGeneracion
) {
}
