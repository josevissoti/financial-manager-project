package com.project.domains;

public class CategoriaLancamento {

    private Long idCategoriaLancamento;
    private String descricao;

    public CategoriaLancamento() {
    }

    public CategoriaLancamento(Long idCategoriaLancamento, String descricao) {
        this.idCategoriaLancamento = idCategoriaLancamento;
        this.descricao = descricao;
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
}
