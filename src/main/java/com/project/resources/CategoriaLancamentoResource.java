package com.project.resources;

import com.project.domains.CategoriaLancamento;
import com.project.domains.dtos.CategoriaLancamentoDTO;
import com.project.services.CategoriaLancamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/categorialancamento")
@Tag(name = "Categoria Lancamento", description = "API para Gerenciamento de Categorias de Lançamento")
public class CategoriaLancamentoResource {

    @Autowired
    private CategoriaLancamentoService categoriaLancamentoService;

    @GetMapping
    @Operation(summary = "Listar todas as Categorias de Lançamento",
            description = "Retorna uma lista com todas as Categorias de Lançamento cadastradas")
    public ResponseEntity<List<CategoriaLancamentoDTO>> findAll() {
        return ResponseEntity.ok().body(categoriaLancamentoService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Busca uma Categoria de Lançamento por id",
            description = "Realiza a busca de uma Categoria de Lançamento cadastrada por id")
    public ResponseEntity<CategoriaLancamentoDTO> findById(@PathVariable Long id) {
        CategoriaLancamento obj = this.categoriaLancamentoService.findById(id);
        return ResponseEntity.ok().body(new CategoriaLancamentoDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Criar uma nova Categoria de Lançamento",
            description = "Criar uma nova Categoria de Lançamento com base nos dados cadastrados")
    public ResponseEntity<CategoriaLancamentoDTO> create(@Valid @RequestBody CategoriaLancamentoDTO objDto) {
        CategoriaLancamento newObj = categoriaLancamentoService.create(objDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{id}")
                .buildAndExpand(newObj.getIdCategoriaLancamento()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera uma Categoria de Lançamento",
            description = "Altera uma Categoria de Lançamento existente")
    public ResponseEntity<CategoriaLancamentoDTO> update(@PathVariable Long id, @Valid @RequestBody CategoriaLancamentoDTO objDTO) {
        CategoriaLancamento obj = categoriaLancamentoService.update(id, objDTO);
        return ResponseEntity.ok().body(new CategoriaLancamentoDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deletar uma Categoria de Lançamento",
            description = "Remove uma Categoria de Lançamento a partir de seu id")
    public ResponseEntity<CategoriaLancamentoDTO> delete(@PathVariable Long id) {
        categoriaLancamentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}