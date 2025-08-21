package com.project.domains;

import com.project.domains.enums.Situacao;
import com.project.domains.enums.TipoLancamento;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Lancamento {

    private Long idLancamento;
    private String descricao;
    private BigDecimal valor;
    private int parcela;
    private LocalDate dataLancamento;
    private LocalDate prazoVencimento;
    private LocalDate dataBaixa;
    private TipoLancamento tipoLancamento;
    private Situacao situacao;

    public Lancamento() {
    }

    public Lancamento(Long idLancamento, String descricao, BigDecimal valor, int parcela, LocalDate dataLancamento, LocalDate prazoVencimento, LocalDate dataBaixa, TipoLancamento tipoLancamento, Situacao situacao) {
        this.idLancamento = idLancamento;
        this.descricao = descricao;
        this.valor = valor;
        this.parcela = parcela;
        this.dataLancamento = dataLancamento;
        this.prazoVencimento = prazoVencimento;
        this.dataBaixa = dataBaixa;
        this.tipoLancamento = tipoLancamento;
        this.situacao = situacao;
    }

    public Long getIdLancamento() {
        return idLancamento;
    }

    public void setIdLancamento(Long idLancamento) {
        this.idLancamento = idLancamento;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public int getParcela() {
        return parcela;
    }

    public void setParcela(int parcela) {
        this.parcela = parcela;
    }

    public LocalDate getDataLancamento() {
        return dataLancamento;
    }

    public void setDataLancamento(LocalDate dataLancamento) {
        this.dataLancamento = dataLancamento;
    }

    public LocalDate getPrazoVencimento() {
        return prazoVencimento;
    }

    public void setPrazoVencimento(LocalDate prazoVencimento) {
        this.prazoVencimento = prazoVencimento;
    }

    public LocalDate getDataBaixa() {
        return dataBaixa;
    }

    public void setDataBaixa(LocalDate dataBaixa) {
        this.dataBaixa = dataBaixa;
    }

    public TipoLancamento getTipoLancamento() {
        return tipoLancamento;
    }

    public void setTipoLancamento(TipoLancamento tipoLancamento) {
        this.tipoLancamento = tipoLancamento;
    }

    public Situacao getSituacao() {
        return situacao;
    }

    public void setSituacao(Situacao situacao) {
        this.situacao = situacao;
    }
}
