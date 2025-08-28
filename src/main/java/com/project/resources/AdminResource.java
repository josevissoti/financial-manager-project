package com.project.resources;

import com.project.domains.Admin;
import com.project.domains.dtos.AdminDTO;
import com.project.services.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/admin")
public class AdminResource {

    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminDTO>> findAll() {
        return ResponseEntity.ok().body(adminService.findAll());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<AdminDTO> findById(@PathVariable Long id) {
        Admin obj = this.adminService.findById(id);
        return ResponseEntity.ok().body(new AdminDTO(obj));
    }

    @GetMapping(value = "/cpf/{cpf}")
    public ResponseEntity<AdminDTO> findByCpf(@PathVariable String cpf) {
        Admin obj = this.adminService.findByCpf(cpf);
        return ResponseEntity.ok().body(new AdminDTO(obj));
    }

    @GetMapping(value = "/email/{email}")
    public ResponseEntity<AdminDTO> finByEmail(@PathVariable String email) {
        Admin obj = this.adminService.findByEmail(email);
        return ResponseEntity.ok().body(new AdminDTO(obj));
    }

    @PostMapping
    public ResponseEntity<AdminDTO> create(@Valid @RequestBody AdminDTO objDto) {
        Admin newObj = adminService.create(objDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{id}")
                .buildAndExpand(newObj.getIdPessoa()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<AdminDTO> update(@PathVariable Long id, @Valid @RequestBody AdminDTO objDTO) {
        Admin obj = adminService.update(id, objDTO);
        return ResponseEntity.ok().body(new AdminDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<AdminDTO> delete(@PathVariable Long id) {
        adminService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
