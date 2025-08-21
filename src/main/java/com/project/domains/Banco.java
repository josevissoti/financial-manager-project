package com.project.domains;

import com.project.domains.enums.Status;

public class Banco {

    private Integer idBanco;
    private String razaoSocial;
    private Status status;

    public Banco() {
    }

    public Banco(Integer idBanco, String razaoSocial, Status status) {
        this.idBanco = idBanco;
        this.razaoSocial = razaoSocial;
        this.status = status;
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

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
