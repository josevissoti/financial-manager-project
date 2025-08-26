package com.project.resources;

import com.project.domains.dtos.CategoriaLancamentoDTO;
import com.project.services.CategoriaLancamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/categorialancamento")
public class CategoriaLancamentoResource {

    @Autowired
    private CategoriaLancamentoService categoriaLancamentoService;

    @GetMapping
    public ResponseEntity<List<CategoriaLancamentoDTO>> findAll() {
        return ResponseEntity.ok().body(categoriaLancamentoService.findAll());
    }

}
