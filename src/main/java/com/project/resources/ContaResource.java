package com.project.resources;

import com.project.domains.Conta;
import com.project.domains.dtos.ContaDTO;
import com.project.services.ContaService;
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
@RequestMapping(value = "/conta")
@Tag(name = "Conta", description = "API para Gerenciamento de Contas")
public class ContaResource {

    @Autowired
    private ContaService contaService;

    @GetMapping
    @Operation(summary = "Listar todas as Contas",
            description = "Retorna uma lista com todas as Contas cadastradas")
    public ResponseEntity<List<ContaDTO>> findAll() {
        return ResponseEntity.ok().body(contaService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Busca uma Conta por id",
            description = "Realiza a busca de uma Conta cadastrada por id")
    public ResponseEntity<ContaDTO> findById(@PathVariable Long id) {
        Conta obj = this.contaService.findById(id);
        return ResponseEntity.ok().body(new ContaDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Criar uma nova Conta",
            description = "Criar uma nova Conta com base nos dados cadastrados")
    public ResponseEntity<ContaDTO> create(@Valid @RequestBody ContaDTO objDto) {
        Conta newObj = contaService.create(objDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{id}")
                .buildAndExpand(newObj.getIdConta()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera uma Conta",
            description = "Altera uma Conta existente")
    public ResponseEntity<ContaDTO> update(@PathVariable Long id, @Valid @RequestBody ContaDTO objDTO) {
        Conta obj = contaService.update(id, objDTO);
        return ResponseEntity.ok().body(new ContaDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deletar uma Conta",
            description = "Remove uma Conta a partir de seu id")
    public ResponseEntity<ContaDTO> delete(@PathVariable Long id) {
        contaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}