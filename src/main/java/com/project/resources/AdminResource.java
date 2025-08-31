package com.project.resources;

import com.project.domains.Admin;
import com.project.domains.dtos.AdminDTO;
import com.project.services.AdminService;
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
@RequestMapping(value = "/admin")
@Tag(name = "Admin", description = "API para Gerenciamento de Admins")
public class AdminResource {

    @Autowired
    private AdminService adminService;

    @GetMapping
    @Operation(summary = "Listar todos os Admins",
                description = "Retorna uma lista com todos os Admins cadastrados")
    public ResponseEntity<List<AdminDTO>> findAll() {
        return ResponseEntity.ok().body(adminService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Busca um Admin por id",
            description = "Realiza a busca de um Admin cadastrado por id")
    public ResponseEntity<AdminDTO> findById(@PathVariable Long id) {
        Admin obj = this.adminService.findById(id);
        return ResponseEntity.ok().body(new AdminDTO(obj));
    }

    @GetMapping(value = "/cpf/{cpf}")
    @Operation(summary = "Busca um Admin por cpf",
            description = "Realiza a busca de um Admin cadastrado por cpf")
    public ResponseEntity<AdminDTO> findByCpf(@PathVariable String cpf) {
        Admin obj = this.adminService.findByCpf(cpf);
        return ResponseEntity.ok().body(new AdminDTO(obj));
    }

    @GetMapping(value = "/email/{email}")
    @Operation(summary = "Busca um Admin por email",
            description = "Realiza a busca de um Admin cadastrado por email")
    public ResponseEntity<AdminDTO> finByEmail(@PathVariable String email) {
        Admin obj = this.adminService.findByEmail(email);
        return ResponseEntity.ok().body(new AdminDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Criar um novo Admin",
            description = "Criar um novo Admin com base nos dados cadastrados")
    public ResponseEntity<AdminDTO> create(@Valid @RequestBody AdminDTO objDto) {
        Admin newObj = adminService.create(objDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{id}")
                .buildAndExpand(newObj.getIdPessoa()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera um Admin",
            description = "Altera um Admin existente")
    public ResponseEntity<AdminDTO> update(@PathVariable Long id, @Valid @RequestBody AdminDTO objDTO) {
        Admin obj = adminService.update(id, objDTO);
        return ResponseEntity.ok().body(new AdminDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deletar um Admin",
            description = "Remove um Admin a partir de seu id")
    public ResponseEntity<AdminDTO> delete(@PathVariable Long id) {
        adminService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
