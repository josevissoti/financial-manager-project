package com.project.services;

import com.project.domains.Admin;
import com.project.domains.dtos.AdminDTO;
import com.project.repositories.AdminRepository;
import org.hibernate.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<AdminDTO> findAll() {
        return adminRepository.findAll().stream()
                .map(obj -> new AdminDTO(obj))
                .collect(Collectors.toList());
    }

}
