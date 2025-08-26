package com.project.services;

import com.project.domains.Banco;
import com.project.domains.dtos.BancoDTO;
import com.project.repositories.BancoRepository;
import com.project.services.exceptions.DataIntegrityViolationException;
import com.project.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

    public Banco findById(Integer id){
        Optional<Banco> obj = bancoRepository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. ID: " + id));
    }

    public Banco findByRazaoSocial(String razaoSocial) {
        Optional<Banco> obj = bancoRepository.findByRazaoSocial(razaoSocial);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. Razão Social: " + razaoSocial));
    }

    public Banco create(BancoDTO objDto) {
        objDto.setIdBanco(null);
        ValidaBanco(objDto);
        Banco newObj = new Banco(objDto);
        return bancoRepository.save(newObj);
    }

    public Banco update(Integer id, BancoDTO objDto) {
        objDto.setIdBanco(id);
        Banco oldObj = findById(id);
        ValidaBanco(objDto);
        oldObj = new Banco(objDto);
        return bancoRepository.save(oldObj);
    }

    public void delete(Integer id) {
        Banco obj = findById(id);
        if (obj.getContas().size() > 0) {
            throw new DataIntegrityViolationException("Admin não pode ser deletado pois possui vinculos cadastrados");
        }
        bancoRepository.deleteById(id);
    }

    public void ValidaBanco(BancoDTO dto){
        Optional<Banco> obj = bancoRepository.findByRazaoSocial(dto.getRazaoSocial());
        if(obj.isPresent() && obj.get().getIdBanco() != dto.getIdBanco()){
            throw new DataIntegrityViolationException("Razão Social já cadastrado");
        }
    }

}
