package com.project.domains;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.domains.enums.FuncaoPessoa;
import com.project.domains.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "pessoa")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_pessoa")
    @SequenceGenerator(name = "seq_pessoa", sequenceName = "seq_pessoa", allocationSize = 1)
    protected Long idPessoa;

    @NotNull
    @NotBlank
    protected String nome;

    @NotNull
    @NotBlank
    protected String cpf;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    protected LocalDate dataNascimento;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    protected LocalDate dataCriacao = LocalDate.now();

    @NotNull
    @NotBlank
    protected String telefone;

    @NotNull
    @NotBlank
    protected String email;

    @NotNull
    @NotBlank
    protected String senha;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "perfis", joinColumns = @JoinColumn(name = "id_pessoa"))
    @Column(name = "funcao_pessoa")
    protected Set<Integer> funcaoPessoa = new HashSet<>();

    @Enumerated(EnumType.ORDINAL)
    @JoinColumn(name = "status")
    protected Status status;

    @JsonIgnore
    @OneToMany(mappedBy = "pessoa")
    private List<Conta> contas = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "pessoa")
    private List<CategoriaLancamento> categoriaLancamentos = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "pessoa")
    private List<Lancamento> lancamentos = new ArrayList<>();

    public Pessoa() {
        addFuncaoPessoa(FuncaoPessoa.USUARIO);
    }

    public Pessoa(Long idPessoa, String nome, String cpf, LocalDate dataNascimento, LocalDate dataCriacao, String telefone, String email, String senha, Status status) {
        this.idPessoa = idPessoa;
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.dataCriacao = dataCriacao;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
        this.status = status;
    }

    public Long getIdPessoa() {
        return idPessoa;
    }

    public void setIdPessoa(Long idPessoa) {
        this.idPessoa = idPessoa;
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

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
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

    public Set<FuncaoPessoa> getFuncaoPessoa() {
        return funcaoPessoa.stream().map(FuncaoPessoa::toEnum).collect(Collectors.toSet());
    }

    public void addFuncaoPessoa(FuncaoPessoa funcaoPessoa) {
        this.funcaoPessoa.add(funcaoPessoa.getId());
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setFuncaoPessoa(Set<Integer> funcaoPessoa) {
        this.funcaoPessoa = funcaoPessoa;
    }

    public List<Conta> getContas() {
        return contas;
    }

    public void setContas(List<Conta> contas) {
        this.contas = contas;
    }

    public List<CategoriaLancamento> getCategoriaLancamentos() {
        return categoriaLancamentos;
    }

    public void setCategoriaLancamentos(List<CategoriaLancamento> categoriaLancamentos) {
        this.categoriaLancamentos = categoriaLancamentos;
    }

    public List<Lancamento> getLancamentos() {
        return lancamentos;
    }

    public void setLancamentos(List<Lancamento> lancamentos) {
        this.lancamentos = lancamentos;
    }

    // ✅ NOVO MÉTODO PARA SPRING SECURITY
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getFuncaoPessoa().stream()
                .map(funcao -> new SimpleGrantedAuthority("ROLE_" + funcao.name()))
                .collect(Collectors.toList());
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Pessoa pessoa = (Pessoa) o;
        return Objects.equals(idPessoa, pessoa.idPessoa) && Objects.equals(cpf, pessoa.cpf) && Objects.equals(email, pessoa.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPessoa, cpf, email);
    }
}