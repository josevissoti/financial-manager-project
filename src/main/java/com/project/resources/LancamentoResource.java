package com.project.resources;

import com.project.domains.Lancamento;
import com.project.domains.dtos.LancamentoDTO;
import com.project.services.LancamentoService;
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
@RequestMapping(value = "/lancamento")
@Tag(name = "Lançamento", description = "API para Gerenciamento de Lançamentos")
public class LancamentoResource {

    @Autowired
    private LancamentoService lancamentoService;

    @GetMapping
    @Operation(summary = "Listar todos os Lançamentos",
            description = "Retorna uma lista com todos os Lançamentos cadastrados")
    public ResponseEntity<List<LancamentoDTO>> findAll() {
        return ResponseEntity.ok().body(lancamentoService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Busca um Lançamento por id",
            description = "Realiza a busca de um Lançamento cadastrado por id")
    public ResponseEntity<LancamentoDTO> findById(@PathVariable Long id) {
        Lancamento obj = this.lancamentoService.findById(id);
        return ResponseEntity.ok().body(new LancamentoDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Criar um novo Lançamento",
            description = "Criar um novo Lançamento com base nos dados cadastrados")
    public ResponseEntity<LancamentoDTO> create(@Valid @RequestBody LancamentoDTO objDto) {
        Lancamento newObj = lancamentoService.create(objDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{id}")
                .buildAndExpand(newObj.getIdLancamento()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera um Lançamento",
            description = "Altera um Lançamento existente")
    public ResponseEntity<LancamentoDTO> update(@PathVariable Long id, @Valid @RequestBody LancamentoDTO objDTO) {
        Lancamento obj = lancamentoService.update(id, objDTO);
        return ResponseEntity.ok().body(new LancamentoDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deletar um Lançamento",
            description = "Remove um Lançamento a partir de seu id")
    public ResponseEntity<LancamentoDTO> delete(@PathVariable Long id) {
        lancamentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}