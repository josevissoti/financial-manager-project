package com.project.domains;

import com.project.domains.enums.TipoConta;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "conta")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_conta")
    private Integer idConta;

    @NotNull
    @NotBlank
    private String descricao;

    @Digits(integer = 15, fraction = 3)
    private BigDecimal saldo;

    @Digits(integer = 15, fraction = 3)
    private BigDecimal limite;

    @NotNull
    @NotBlank
    private String agencia;

    @NotNull
    @NotBlank
    private String numero;

    @Enumerated(EnumType.ORDINAL)
    @JoinColumn(name = "tipoConta")
    private TipoConta tipoConta;

    @ManyToOne
    @JoinColumn(name = "idpessoa")
    private Pessoa pessoa;

    @ManyToOne
    @JoinColumn(name = "idbanco")
    private Banco banco;

    public Conta() {
    }

    public Conta(Integer idConta, String descricao, BigDecimal saldo, BigDecimal limite, String agencia, String numero, TipoConta tipoConta, Pessoa pessoa, Banco banco) {
        this.idConta = idConta;
        this.descricao = descricao;
        this.saldo = saldo;
        this.limite = limite;
        this.agencia = agencia;
        this.numero = numero;
        this.tipoConta = tipoConta;
        this.pessoa = pessoa;
        this.banco = banco;
    }

    public Integer getIdConta() {
        return idConta;
    }

    public void setIdConta(Integer idConta) {
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

    public TipoConta getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(TipoConta tipoConta) {
        this.tipoConta = tipoConta;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public Banco getBanco() {
        return banco;
    }

    public void setBanco(Banco banco) {
        this.banco = banco;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Conta conta = (Conta) o;
        return Objects.equals(idConta, conta.idConta);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(idConta);
    }
}
