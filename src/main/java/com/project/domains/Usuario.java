package com.project.domains;

import com.project.domains.enums.FuncaoPessoa;
import com.project.domains.enums.Status;

import java.time.LocalDate;

public class Usuario extends Pessoa{

    public Usuario(Long idPessoa, String nome, String cpf, LocalDate dataNascimento, LocalDate dataCriacao, String telefone, String email, String senha, Status status) {
        super(idPessoa, nome, cpf, dataNascimento, dataCriacao, telefone, email, senha, status);
        addFuncaoPessoa(FuncaoPessoa.USUARIO);
    }

    public Usuario() {
        super();
        addFuncaoPessoa(FuncaoPessoa.USUARIO);
    }
}
