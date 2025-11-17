package com.project.domains.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.domains.Lancamento;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LancamentoDTO {

    private Long idLancamento;

    @NotNull(message = "O campo Descrição não pode ser nulo")
    @NotBlank(message = "O campo Descrição não pode ser vazio")
    private String descricao;

    @NotNull(message = "O campo Valor não pode ser nulo")
    @Digits(integer = 15, fraction = 3)
    private BigDecimal valor;

    private int parcela;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dataLancamento = LocalDate.now();

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate prazoVencimento;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dataBaixa;

    private int tipoLancamento;
    private int situacao;

    @NotNull(message = "O campo pessoa é requerido")
    private Long idPessoa;
    private String nome;
    private String email;

    @NotNull(message = "O campo Categoria Lançamento é requerido")
    private Long idCategoriaLancamento;
    private String descricaoCategoriaLancamento;

    @NotNull(message = "O campo Conta é requerido")
    private Long idConta;
    private String descricaoConta;
    private BigDecimal saldo;
    private String agencia;
    private String numero;

    public LancamentoDTO() {
    }

    public LancamentoDTO(Lancamento lancamento) {
        this.idLancamento = lancamento.getIdLancamento();
        this.descricao = lancamento.getDescricao();
        this.valor = lancamento.getValor();
        this.parcela = lancamento.getParcela();
        this.dataLancamento = lancamento.getDataLancamento();
        this.prazoVencimento = lancamento.getPrazoVencimento();
        this.dataBaixa = lancamento.getDataBaixa();
        this.tipoLancamento = lancamento.getTipoLancamento().getId();
        this.situacao = lancamento.getSituacao().getId();
        this.idPessoa = lancamento.getPessoa().getIdPessoa();
        this.nome = lancamento.getPessoa().getNome();
        this.email = lancamento.getPessoa().getEmail();
        this.idCategoriaLancamento = lancamento.getCategoriaLancamento().getIdCategoriaLancamento();
        this.descricaoCategoriaLancamento = lancamento.getCategoriaLancamento().getDescricao();
        this.idConta = lancamento.getConta().getIdConta();
        this.descricaoConta = lancamento.getConta().getDescricao();
        this.saldo = lancamento.getConta().getSaldo();
        this.agencia = lancamento.getConta().getAgencia();
        this.numero = lancamento.getConta().getNumero();
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

    public int getTipoLancamento() {
        return tipoLancamento;
    }

    public void setTipoLancamento(int tipoLancamento) {
        this.tipoLancamento = tipoLancamento;
    }

    public int getSituacao() {
        return situacao;
    }

    public void setSituacao(int situacao) {
        this.situacao = situacao;
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

    public Long getIdCategoriaLancamento() {
        return idCategoriaLancamento;
    }

    public void setIdCategoriaLancamento(Long idCategoriaLancamento) {
        this.idCategoriaLancamento = idCategoriaLancamento;
    }

    public String getDescricaoCategoriaLancamento() {
        return descricaoCategoriaLancamento;
    }

    public void setDescricaoCategoriaLancamento(String descricaoCategoriaLancamento) {
        this.descricaoCategoriaLancamento = descricaoCategoriaLancamento;
    }

    public Long getIdConta() {
        return idConta;
    }

    public void setIdConta(Long idConta) {
        this.idConta = idConta;
    }

    public String getDescricaoConta() {
        return descricaoConta;
    }

    public void setDescricaoConta(String descricaoConta) {
        this.descricaoConta = descricaoConta;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
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
}
