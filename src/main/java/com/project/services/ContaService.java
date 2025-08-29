package com.project.services;

import com.project.domains.Conta;
import com.project.domains.dtos.ContaDTO;
import com.project.repositories.ContaRepository;
import com.project.services.exceptions.DataIntegrityViolationException;
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

    public Conta findById(Long id) {
        Optional<Conta> obj = contaRepository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. ID: " + id));
    }

    public Conta create(ContaDTO objDto) {
        objDto.setIdConta(null);
        Conta newObj = new Conta(objDto);
        return contaRepository.save(newObj);
    }

    public Conta update(Long id, ContaDTO objDto) {
        objDto.setIdConta(id);
        Conta oldObj = findById(id);
        oldObj = new Conta(objDto);
        return contaRepository.save(oldObj);
    }

    public void delete(Long id) {
        Conta obj = findById(id);
        if (obj.getLancamentos().size() > 0) {
            throw new DataIntegrityViolationException("Conta não pode ser deletada pois possui vinculos cadastrados");
        }
        contaRepository.deleteById(id);
    }

}
