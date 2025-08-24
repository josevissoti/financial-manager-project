package com.project.domains;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;

@Entity
@Table(name = "categorialancamento")
public class CategoriaLancamento {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "seq_categorialancamento")
    private Long idCategoriaLancamento;

    @NotNull
    @NotBlank
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "idpessoa")
    private Pessoa pessoa;

    public CategoriaLancamento() {
    }

    public CategoriaLancamento(Long idCategoriaLancamento, String descricao, Pessoa pessoa) {
        this.idCategoriaLancamento = idCategoriaLancamento;
        this.descricao = descricao;
        this.pessoa = pessoa;
    }

    public Long getIdCategoriaLancamento() {
        return idCategoriaLancamento;
    }

    public void setIdCategoriaLancamento(Long idCategoriaLancamento) {
        this.idCategoriaLancamento = idCategoriaLancamento;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        CategoriaLancamento that = (CategoriaLancamento) o;
        return Objects.equals(idCategoriaLancamento, that.idCategoriaLancamento);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(idCategoriaLancamento);
    }
}
