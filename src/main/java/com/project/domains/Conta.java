package com.project.domains;

import com.project.domains.enums.TipoConta;

import java.math.BigDecimal;

public class Conta {

    private Integer idConta;
    private String descricao;
    private BigDecimal saldo;
    private BigDecimal limite;
    private String agencia;
    private String numero;
    private TipoConta tipoConta;

    public Conta() {
    }

    public Conta(Integer idConta, String descricao, BigDecimal saldo, BigDecimal limite, String agencia, String numero, TipoConta tipoConta) {
        this.idConta = idConta;
        this.descricao = descricao;
        this.saldo = saldo;
        this.limite = limite;
        this.agencia = agencia;
        this.numero = numero;
        this.tipoConta = tipoConta;
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
}
