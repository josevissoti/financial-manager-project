package com.project.services;

import com.project.domains.Lancamento;
import com.project.domains.dtos.LancamentoDTO;
import com.project.repositories.LancamentoRepository;
import com.project.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

    public Lancamento findById(Long id) {
        Optional<Lancamento> obj = lancamentoRepository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. ID> " + id));
    }

    public Lancamento create(LancamentoDTO objDto) {
        objDto.setIdConta(null);
        Lancamento newObj = new Lancamento(objDto);
        return lancamentoRepository.save(newObj);
    }

    public Lancamento update(Long id, LancamentoDTO objDto) {
        objDto.setIdLancamento(id);
        Lancamento oldObj = findById(id);
        oldObj = new Lancamento(objDto);
        return lancamentoRepository.save(oldObj);
    }

    public void delete(Long id) {
        lancamentoRepository.deleteById(id);
    }

}
