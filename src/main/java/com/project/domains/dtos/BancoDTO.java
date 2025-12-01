package com.project.domains.dtos;

import com.project.domains.Banco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BancoDTO {

    private Integer idBanco;

    @NotNull(message = "O campo Razão Social não pode ser nulo")
    @NotBlank(message = "O campo Razão Social não pode ser vazio")
    private String razaoSocial;

    private int status;

    public BancoDTO() {
    }

    public BancoDTO(Banco banco) {
        this.idBanco = banco.getIdBanco();
        this.razaoSocial = banco.getRazaoSocial();
        this.status = banco.getStatus().getId();
    }

    public Integer getIdBanco() {
        return idBanco;
    }

    public void setIdBanco(Integer idBanco) {
        this.idBanco = idBanco;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
