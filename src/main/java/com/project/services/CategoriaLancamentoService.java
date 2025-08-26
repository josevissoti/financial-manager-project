package com.project.services;

import com.project.domains.CategoriaLancamento;
import com.project.domains.dtos.CategoriaLancamentoDTO;
import com.project.repositories.CategoriaLancamentoRepostory;
import com.project.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoriaLancamentoService {

    @Autowired
    private CategoriaLancamentoRepostory categoriaLancamentoRepostory;

    public List<CategoriaLancamentoDTO> findAll() {
        return categoriaLancamentoRepostory.findAll().stream()
                .map(obj -> new CategoriaLancamentoDTO(obj))
                .collect(Collectors.toList());
    }

    public CategoriaLancamento findById(Long id){
        Optional<CategoriaLancamento> obj = categoriaLancamentoRepostory.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. ID> " + id));
    }

}
