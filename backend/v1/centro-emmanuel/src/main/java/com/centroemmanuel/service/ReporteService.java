package com.centroemmanuel.service;

import org.springframework.stereotype.Service;
import com.centroemmanuel.repository.ProductoRepository;

@Service
public class ReporteService {

    private final ProductoRepository productoRepository;

    public ReporteService(
            ProductoRepository productoRepository
    ) {
        this.productoRepository = productoRepository;
    }

}
