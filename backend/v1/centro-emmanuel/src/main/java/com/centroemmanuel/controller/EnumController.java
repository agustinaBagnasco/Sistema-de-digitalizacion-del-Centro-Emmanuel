package com.centroemmanuel.controller;

import com.centroemmanuel.enums.Categoria;
import com.centroemmanuel.enums.UnidadMedida;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EnumController {

    @GetMapping("/categorias")
    public List<String> categorias() {
        return Arrays.stream(Categoria.values()).map(Enum::name).toList();
    }

    @GetMapping("/unidades-medida")
    public List<String> unidadesMedida() {
        return Arrays.stream(UnidadMedida.values()).map(Enum::name).toList();
    }
}
