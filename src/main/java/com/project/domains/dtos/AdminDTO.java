package com.project.domains.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.domains.Admin;
import com.project.domains.enums.FuncaoPessoa;
import com.project.domains.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class AdminDTO {

    protected Long idAdmin;

    @NotNull(message = "O campo Nome não pode ser nulo")
    @NotBlank(message = "O campo Nome não pode ser vazio")
    protected String nome;

    @NotNull(message = "O campo CPF não pode ser nulo")
    @CPF
    protected String cpf;

    @JsonFormat(pattern = "dd/MM/yyyy")
    protected LocalDate datanascimento;

    @JsonFormat(pattern = "dd/MM/yyyy")
    protected LocalDate dataCriacao = LocalDate.now();

    @NotNull(message = "O campo Telefone não pode ser nulo")
    @NotBlank(message = "O campo Telegone não pode ser vazio")
    protected String telefone;

    @NotNull(message = "O campo Email não pode ser nulo")
    @NotBlank(message = "O campo Email não pode ser vazio")
    protected String email;

    @NotNull(message = "O campo Senha não pode ser nulo")
    @NotBlank(message = "O campo Senha não pode ser vazio")
    protected String senha;

    protected int status;

    protected Set<Integer> funcaoPessoa = new HashSet<>();

    public AdminDTO() {
    }

    public AdminDTO(Admin admin) {
        this.idAdmin = admin.getIdPessoa();
        this.nome = admin.getNome();
        this.cpf = admin.getCpf();
        this.datanascimento = admin.getDataNascimento();
        this.dataCriacao = admin.getDataCriacao();
        this.telefone = admin.getTelefone();
        this.email = admin.getEmail();
        this.senha = admin.getSenha();
        this.status = admin.getStatus().getId();
        this.funcaoPessoa.stream().map(FuncaoPessoa::toEnum).collect(Collectors.toSet());
    }

    public Long getIdAdmin() {
        return idAdmin;
    }

    public void setIdAdmin(Long idAdmin) {
        this.idAdmin = idAdmin;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public LocalDate getDatanascimento() {
        return datanascimento;
    }

    public void setDatanascimento(LocalDate datanascimento) {
        this.datanascimento = datanascimento;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Set<FuncaoPessoa> getFuncaoPessoa() {
        return funcaoPessoa == null ? Collections.emptySet() :
                funcaoPessoa.stream().map(FuncaoPessoa::toEnum).collect(Collectors.toSet());
    }

    public void addFuncaoPessoa(FuncaoPessoa funcaoPessoa) {
        this.funcaoPessoa.add(funcaoPessoa.getId());
    }
}
