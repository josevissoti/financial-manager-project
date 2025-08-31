package com.project.resources;

import com.project.domains.Banco;
import com.project.domains.dtos.BancoDTO;
import com.project.services.BancoService;
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
@RequestMapping(value = "/banco")
@Tag(name = "Banco", description = "API para Gerenciamento de Bancos")
public class BancoResource {

    @Autowired
    private BancoService bancoService;

    @GetMapping
    @Operation(summary = "Listar todos os Bancos",
            description = "Retorna uma lista com todos os Bancos cadastrados")
    public ResponseEntity<List<BancoDTO>> findAll() {
        return ResponseEntity.ok().body(bancoService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Busca um Banco por id",
            description = "Realiza a busca de um Banco cadastrado por id")
    public ResponseEntity<BancoDTO> findById(@PathVariable Integer id) {
        Banco obj = this.bancoService.findById(id);
        return ResponseEntity.ok().body(new BancoDTO(obj));
    }

    @GetMapping(value = "/razaosocial/{razaosocial}")
    @Operation(summary = "Busca um Banco por razão social",
            description = "Realiza a busca de um Banco cadastrado por razão social")
    public ResponseEntity<BancoDTO> findByRazaoSocial(@PathVariable String razaosocial) {
        Banco obj = this.bancoService.findByRazaoSocial(razaosocial);
        return ResponseEntity.ok().body(new BancoDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Criar um novo Banco",
            description = "Criar um novo Banco com base nos dados cadastrados")
    public ResponseEntity<BancoDTO> create(@Valid @RequestBody BancoDTO objDto) {
        Banco newObj = bancoService.create(objDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{id}")
                .buildAndExpand(newObj.getIdBanco()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera um Banco",
            description = "Altera um Banco existente")
    public ResponseEntity<BancoDTO> update(@PathVariable Integer id, @Valid @RequestBody BancoDTO objDTO) {
        Banco obj = bancoService.update(id, objDTO);
        return ResponseEntity.ok().body(new BancoDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deletar um Banco",
            description = "Remove um Banco a partir de seu id")
    public ResponseEntity<BancoDTO> delete(@PathVariable Integer id) {
        bancoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}