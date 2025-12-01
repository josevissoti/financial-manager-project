package com.project.resources;

import com.project.domains.Usuario;
import com.project.domains.dtos.UsuarioDTO;
import com.project.services.UsuarioService;
import com.project.services.exceptions.DataIntegrityViolationException;
import com.project.services.exceptions.ObjectNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/admin/users")
@Tag(name = "Gerenciamento de Usuários", description = "API para Admins gerenciarem usuários")
public class UserManagementResource {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar todos os Usuários (apenas Admin)")
    public ResponseEntity<List<UsuarioDTO>> findAllUsers() {
        return ResponseEntity.ok().body(usuarioService.findAll());
    }

    @PutMapping("/promote/{id}")
    @Operation(summary = "Promover usuário para Admin")
    public ResponseEntity<UsuarioDTO> promoteToAdmin(@PathVariable Long id) {
        try {
            Usuario usuarioPromovido = usuarioService.promoteToAdmin(id);
            return ResponseEntity.ok().body(new UsuarioDTO(usuarioPromovido));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().build();
        } catch (ObjectNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}