package com.project.services;

import com.project.domains.dtos.LancamentoDTO;
import com.project.repositories.LancamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LancamentoService {

    @Autowired
    private LancamentoRepository lancamentoRepository;

    public List<LancamentoDTO> findAll() {
        return lancamentoRepository.findAll().stream()
                .map(obj -> new LancamentoDTO(obj))
                .collect(Collectors.toList());
    }

}
