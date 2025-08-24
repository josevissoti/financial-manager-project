package com.project.domains;

import com.project.domains.enums.FuncaoPessoa;
import com.project.domains.enums.Status;

import java.time.LocalDate;

public class Admin extends Pessoa {

    public Admin(Long idPessoa, String nome, String cpf, LocalDate dataNascimento, LocalDate dataCriacao, String telefone, String email, String senha, Status status) {
        super(idPessoa, nome, cpf, dataNascimento, dataCriacao, telefone, email, senha, status);
        addFuncaoPessoa(FuncaoPessoa.USUARIO);
        addFuncaoPessoa(FuncaoPessoa.ADMIN);
    }

    public Admin() {
        super();
        addFuncaoPessoa(FuncaoPessoa.USUARIO);
        addFuncaoPessoa(FuncaoPessoa.ADMIN);
    }
}
