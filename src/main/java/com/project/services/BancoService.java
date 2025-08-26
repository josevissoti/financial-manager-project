package com.project.services;

import com.project.domains.dtos.BancoDTO;
import com.project.repositories.BancoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BancoService {

    @Autowired
    private BancoRepository bancoRepository;

    public List<BancoDTO> findAll() {
        return bancoRepository.findAll().stream()
                .map(obj -> new BancoDTO(obj))
                .collect(Collectors.toList());
    }

}
