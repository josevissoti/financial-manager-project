package com.project.services;

import com.project.repositories.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PessoaRepositoryStatic {

    private static PessoaRepository pessoaRepository;

    @Autowired
    public PessoaRepositoryStatic(PessoaRepository pessoaRepository) {
        PessoaRepositoryStatic.pessoaRepository = pessoaRepository;
    }

    public static Long findIdByEmail(String email) {
        return pessoaRepository.findByEmail(email)
                .map(pessoa -> pessoa.getIdPessoa())
                .orElse(null);
    }
}