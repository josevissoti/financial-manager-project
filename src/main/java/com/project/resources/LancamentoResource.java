package com.project.resources;

import com.project.domains.Conta;
import com.project.domains.Lancamento;
import com.project.domains.dtos.ContaDTO;
import com.project.domains.dtos.LancamentoDTO;
import com.project.services.LancamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/lancamento")
public class LancamentoResource {

    @Autowired
    private LancamentoService lancamentoService;

    @GetMapping
    public ResponseEntity<List<LancamentoDTO>> findAll() {
        return ResponseEntity.ok().body(lancamentoService.findAll());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<LancamentoDTO> findById(@PathVariable Long id) {
        Lancamento obj = this.lancamentoService.findById(id);
        return ResponseEntity.ok().body(new LancamentoDTO(obj));
    }

    @PostMapping
    public ResponseEntity<LancamentoDTO> create(@Valid @RequestBody LancamentoDTO objDto) {
        Lancamento newObj = lancamentoService.create(objDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{id}")
                .buildAndExpand(newObj.getIdLancamento()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<LancamentoDTO> update(@PathVariable Long id, @Valid @RequestBody LancamentoDTO objDTO) {
        Lancamento obj = lancamentoService.update(id, objDTO);
        return ResponseEntity.ok().body(new LancamentoDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<LancamentoDTO> delete(@PathVariable Long id) {
        lancamentoService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
