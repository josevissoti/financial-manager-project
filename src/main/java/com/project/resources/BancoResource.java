package com.project.resources;

import com.project.domains.Banco;
import com.project.domains.dtos.BancoDTO;
import com.project.services.BancoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/banco")
public class BancoResource {

    @Autowired
    private BancoService bancoService;

    @GetMapping
    public ResponseEntity<List<BancoDTO>> findAll() {
        return ResponseEntity.ok().body(bancoService.findAll());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<BancoDTO> findById(@PathVariable Integer id) {
        Banco obj = this.bancoService.findById(id);
        return ResponseEntity.ok().body(new BancoDTO(obj));
    }

    @GetMapping(value = "/razaosocial/{razaosocial}")
    public ResponseEntity<BancoDTO> findByRazaoSocial(@PathVariable String razaosocial) {
        Banco obj = this.bancoService.findByRazaoSocial(razaosocial);
        return ResponseEntity.ok().body(new BancoDTO(obj));
    }

    @PostMapping
    public ResponseEntity<BancoDTO> create(@Valid @RequestBody BancoDTO objDto) {
        Banco newObj = bancoService.create(objDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{id}")
                .buildAndExpand(newObj.getIdBanco()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<BancoDTO> update(@PathVariable Integer id, @Valid @RequestBody BancoDTO objDTO) {
        Banco obj = bancoService.update(id, objDTO);
        return ResponseEntity.ok().body(new BancoDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<BancoDTO> delete(@PathVariable Integer id) {
        bancoService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
