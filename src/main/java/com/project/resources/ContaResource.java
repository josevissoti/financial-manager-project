package com.project.resources;

import com.project.domains.Conta;
import com.project.domains.dtos.ContaDTO;
import com.project.services.ContaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/conta")
public class ContaResource {

    @Autowired
    private ContaService contaService;

    @GetMapping
    public ResponseEntity<List<ContaDTO>> findAll() {
        return ResponseEntity.ok().body(contaService.findAll());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ContaDTO> findById(@PathVariable Long id) {
        Conta obj = this.contaService.findById(id);
        return ResponseEntity.ok().body(new ContaDTO(obj));
    }

    @PostMapping
    public ResponseEntity<ContaDTO> create(@Valid @RequestBody ContaDTO objDto) {
        Conta newObj = contaService.create(objDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{id}")
                .buildAndExpand(newObj.getIdConta()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ContaDTO> update(@PathVariable Long id, @Valid @RequestBody ContaDTO objDTO) {
        Conta obj = contaService.update(id, objDTO);
        return ResponseEntity.ok().body(new ContaDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<ContaDTO> delete(@PathVariable Long id) {
        contaService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
