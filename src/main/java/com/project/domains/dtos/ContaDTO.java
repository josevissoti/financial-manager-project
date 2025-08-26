package com.project.domains.dtos;

import com.project.domains.Conta;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class ContaDTO {

    private Long idConta;

    @NotNull(message = "O campo Descrição não pode ser nulo")
    @NotBlank(message = "O campo Descrição não pode ser vazio")
    private String descricao;

    @NotNull(message = "O campo Saldo não pode ser nulo")
    @Digits(integer = 15, fraction = 3)
    private BigDecimal saldo;

    @NotNull(message = "O campo Limite não pode ser nulo")
    @Digits(integer = 15, fraction = 3)
    private BigDecimal limite;

    @NotNull(message = "O campo Agência não pode ser nulo")
    @NotBlank(message = "O campo Agência não pode ser vazio")
    private String agencia;

    @NotNull(message = "O campo Número não pode ser nulo")
    @NotBlank(message = "O campo Número não pode ser vazio")
    private String numero;

    private int tipoConta;

    @NotNull(message = "O campo Pessoa é requerodo")
    private Long idPessoa;
    private String nome;
    private String email;

    public ContaDTO() {
    }

    public ContaDTO(Conta conta) {
        this.idConta = conta.getIdConta();
        this.descricao = conta.getDescricao();
        this.saldo = conta.getSaldo();
        this.limite = conta.getLimite();
        this.agencia = conta.getAgencia();
        this.numero = conta.getNumero();
        this.tipoConta = conta.getTipoConta().getId();
        this.idPessoa = conta.getPessoa().getIdPessoa();
        this.nome = conta.getPessoa().getNome();
        this.email = conta.getPessoa().getEmail();
    }

    public Long getIdConta() {
        return idConta;
    }

    public void setIdConta(Long idConta) {
        this.idConta = idConta;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }

    public BigDecimal getLimite() {
        return limite;
    }

    public void setLimite(BigDecimal limite) {
        this.limite = limite;
    }

    public String getAgencia() {
        return agencia;
    }

    public void setAgencia(String agencia) {
        this.agencia = agencia;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public int getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(int tipoConta) {
        this.tipoConta = tipoConta;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
