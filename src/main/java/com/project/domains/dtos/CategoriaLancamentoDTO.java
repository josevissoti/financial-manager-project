package com.project.domains.dtos;

import com.project.domains.CategoriaLancamento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CategoriaLancamentoDTO {

    private Long idCategoriaLancamento;

    @NotNull(message = "O campo Descrição não pode ser vazio")
    @NotBlank(message = "O campo Descrição não pode ser nulo")
    private String descricao;

    @NotNull(message = "O campo Pessoa é requerido")
    private Long idPessoa;
    private String nome;
    private String email;

    public CategoriaLancamentoDTO() {
    }

    public CategoriaLancamentoDTO(CategoriaLancamento categoriaLancamento) {
        this.idCategoriaLancamento = categoriaLancamento.getIdCategoriaLancamento();
        this.descricao = categoriaLancamento.getDescricao();
        this.idPessoa = categoriaLancamento.getPessoa().getIdPessoa();
        this.nome = categoriaLancamento.getPessoa().getNome();
        this.email = categoriaLancamento.getPessoa().getEmail();
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
