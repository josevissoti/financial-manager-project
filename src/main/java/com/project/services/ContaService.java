package com.project.services;

import com.project.domains.Conta;
import com.project.domains.dtos.ContaDTO;
import com.project.repositories.ContaRepository;
import com.project.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

    public Conta findById(Long id){
        Optional<Conta> obj = contaRepository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. ID> " + id));
    }

}
