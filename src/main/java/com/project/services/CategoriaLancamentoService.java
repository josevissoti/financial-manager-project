package com.project.services;

import com.project.domains.CategoriaLancamento;
import com.project.domains.dtos.CategoriaLancamentoDTO;
import com.project.repositories.CategoriaLancamentoRepostory;
import com.project.services.exceptions.DataIntegrityViolationException;
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

    public CategoriaLancamento findById(Long id) {
        Optional<CategoriaLancamento> obj = categoriaLancamentoRepostory.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. ID: " + id));
    }

    public CategoriaLancamento create(CategoriaLancamentoDTO objDto) {
        objDto.setIdCategoriaLancamento(null);
        CategoriaLancamento newObj = new CategoriaLancamento(objDto);
        return categoriaLancamentoRepostory.save(newObj);
    }

    public CategoriaLancamento update(Long id, CategoriaLancamentoDTO objDto) {
        objDto.setIdCategoriaLancamento(id);
        CategoriaLancamento oldObj = findById(id);
        oldObj = new CategoriaLancamento(objDto);
        return categoriaLancamentoRepostory.save(oldObj);
    }

    public void delete(Long id) {
        CategoriaLancamento obj = findById(id);
        if (obj.getLancamentos().size() > 0) {
            throw new DataIntegrityViolationException("Categoria de Lançamento não pode ser deletada pois possui vinculos cadastrados");
        }
        categoriaLancamentoRepostory.deleteById(id);
    }

}
