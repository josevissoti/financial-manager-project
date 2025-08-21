package com.project.domains;

import com.project.domains.enums.FuncaoPessoa;
import com.project.domains.enums.Status;

import java.time.LocalDate;

public abstract class Pessoa {

    private Long idPessoa;
    private String nome;
    private String cpf;
    private LocalDate dataNascimento;
    private LocalDate dataCriacao;
    private String telefone;
    private String email;
    private String senha;
    private FuncaoPessoa funcaoPessoa;
    private Status status;

    public Pessoa() {
    }

    public Pessoa(Long idPessoa, String nome, String cpf, LocalDate dataNascimento, LocalDate dataCriacao, String telefone, String email, String senha, FuncaoPessoa funcaoPessoa, Status status) {
        this.idPessoa = idPessoa;
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.dataCriacao = dataCriacao;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
        this.funcaoPessoa = funcaoPessoa;
        this.status = status;
    }
}
