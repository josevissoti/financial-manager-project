package com.project.resources;

import com.project.domains.Admin;
import com.project.domains.dtos.AdminDTO;
import com.project.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
