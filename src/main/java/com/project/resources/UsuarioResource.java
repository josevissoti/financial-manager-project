package com.project.resources;

import com.project.domains.Usuario;
import com.project.domains.dtos.UsuarioDTO;
import com.project.services.UsuarioService;
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
@RequestMapping(value = "/usuario")
@Tag(name = "Usuário", description = "API para Gerenciamento de Usuários")
public class UsuarioResource {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar todos os Usuários",
            description = "Retorna uma lista com todos os Usuários cadastrados")
    public ResponseEntity<List<UsuarioDTO>> findAll() {
        return ResponseEntity.ok().body(usuarioService.findAll());
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "Busca um Usuário por id",
            description = "Realiza a busca de um Usuário cadastrado por id")
    public ResponseEntity<UsuarioDTO> findById(@PathVariable Long id) {
        Usuario obj = this.usuarioService.findById(id);
        return ResponseEntity.ok().body(new UsuarioDTO(obj));
    }

    @GetMapping(value = "/cpf/{cpf}")
    @Operation(summary = "Busca um Usuário por cpf",
            description = "Realiza a busca de um Usuário cadastrado por cpf")
    public ResponseEntity<UsuarioDTO> findByCpf(@PathVariable String cpf) {
        Usuario obj = this.usuarioService.findByCpf(cpf);
        return ResponseEntity.ok().body(new UsuarioDTO(obj));
    }

    @GetMapping(value = "/email/{email}")
    @Operation(summary = "Busca um Usuário por email",
            description = "Realiza a busca de um Usuário cadastrado por email")
    public ResponseEntity<UsuarioDTO> finByEmail(@PathVariable String email) {
        Usuario obj = this.usuarioService.findByEmail(email);
        return ResponseEntity.ok().body(new UsuarioDTO(obj));
    }

    @PostMapping
    @Operation(summary = "Criar um novo Usuário",
            description = "Criar um novo Usuário com base nos dados cadastrados")
    public ResponseEntity<UsuarioDTO> create(@Valid @RequestBody UsuarioDTO objDto) {
        Usuario newObj = usuarioService.create(objDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("{id}")
                .buildAndExpand(newObj.getIdPessoa()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    @Operation(summary = "Altera um Usuário",
            description = "Altera um Usuário existente")
    public ResponseEntity<UsuarioDTO> update(@PathVariable Long id, @Valid @RequestBody UsuarioDTO objDTO) {
        Usuario obj = usuarioService.update(id, objDTO);
        return ResponseEntity.ok().body(new UsuarioDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deletar um Usuário",
            description = "Remove um Usuário a partir de seu id")
    public ResponseEntity<UsuarioDTO> delete(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}