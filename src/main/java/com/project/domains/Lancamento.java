package com.project.domains;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.domains.dtos.LancamentoDTO;
import com.project.domains.enums.Situacao;
import com.project.domains.enums.TipoLancamento;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "lancamento")
public class Lancamento {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "seq_lancamento")
    private Long idLancamento;

    @NotNull
    @NotBlank
    private String descricao;

    @Digits(integer = 15, fraction = 3)
    private BigDecimal valor;

    private int parcela;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataLancamento;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate prazoVencimento;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataBaixa;

    @Enumerated(EnumType.ORDINAL)
    @JoinColumn(name = "tipolancamento")
    private TipoLancamento tipoLancamento;

    @Enumerated(EnumType.ORDINAL)
    @JoinColumn(name = "situacao")
    private Situacao situacao;

    @ManyToOne
    @JoinColumn(name = "idpessoa")
    private Pessoa pessoa;

    @ManyToOne
    @JoinColumn(name = "idcategorialancamento")
    private CategoriaLancamento categoriaLancamento;

    @ManyToOne
    @JoinColumn(name = "idconta")
    private Conta conta;

    public Lancamento() {
    }

    public Lancamento(Long idLancamento, String descricao, BigDecimal valor, int parcela, LocalDate dataLancamento, LocalDate prazoVencimento, LocalDate dataBaixa, TipoLancamento tipoLancamento, Situacao situacao, Pessoa pessoa, CategoriaLancamento categoriaLancamento, Conta conta) {
        this.idLancamento = idLancamento;
        this.descricao = descricao;
        this.valor = valor;
        this.parcela = parcela;
        this.dataLancamento = dataLancamento;
        this.prazoVencimento = prazoVencimento;
        this.dataBaixa = dataBaixa;
        this.tipoLancamento = tipoLancamento;
        this.situacao = situacao;
        this.pessoa = pessoa;
        this.categoriaLancamento = categoriaLancamento;
        this.conta = conta;
    }

    public Lancamento(LancamentoDTO dto) {
        this.idLancamento = dto.getIdLancamento();
        this.descricao = dto.getDescricao();
        this.valor = dto.getValor();
        this.parcela = dto.getParcela();
        this.dataLancamento = dto.getDataLancamento();
        this.prazoVencimento = dto.getPrazoVencimento();
        this.dataBaixa = dto.getDataBaixa();
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

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public CategoriaLancamento getCategoriaLancamento() {
        return categoriaLancamento;
    }

    public void setCategoriaLancamento(CategoriaLancamento categoriaLancamento) {
        this.categoriaLancamento = categoriaLancamento;
    }

    public Conta getConta() {
        return conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Lancamento that = (Lancamento) o;
        return Objects.equals(idLancamento, that.idLancamento);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(idLancamento);
    }
}
