package com.project.resources;

import com.project.domains.CategoriaLancamento;
import com.project.domains.dtos.CategoriaLancamentoDTO;
import com.project.services.CategoriaLancamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
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

    @GetMapping(value = "/{id}")
    public ResponseEntity<CategoriaLancamentoDTO> findById(@PathVariable Long id) {
        CategoriaLancamento obj = this.categoriaLancamentoService.findById(id);
        return ResponseEntity.ok().body(new CategoriaLancamentoDTO(obj));
    }

    @PostMapping
    public ResponseEntity<CategoriaLancamentoDTO> create(@Valid @RequestBody CategoriaLancamentoDTO objDto) {
        CategoriaLancamento newObj = categoriaLancamentoService.create(objDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{id}")
                .buildAndExpand(newObj.getIdCategoriaLancamento()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<CategoriaLancamentoDTO> update(@PathVariable Long id, @Valid @RequestBody CategoriaLancamentoDTO objDTO) {
        CategoriaLancamento obj = categoriaLancamentoService.update(id, objDTO);
        return ResponseEntity.ok().body(new CategoriaLancamentoDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<CategoriaLancamentoDTO> delete(@PathVariable Long id) {
        categoriaLancamentoService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
