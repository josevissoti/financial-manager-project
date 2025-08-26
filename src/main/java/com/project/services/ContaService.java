package com.project.services;

import com.project.domains.dtos.ContaDTO;
import com.project.repositories.ContaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContaService {

    @Autowired
    private ContaRepository contaRepository;

    public List<ContaDTO> findAll() {
        return contaRepository.findAll().stream()
                .map(obj -> new ContaDTO(obj))
                .collect(Collectors.toList());
    }

}
