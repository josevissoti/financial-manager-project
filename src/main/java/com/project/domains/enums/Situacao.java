package com.project.domains.enums;

public enum Situacao {
    PENDENTE(0, "PENDENTE"),
    BAIXADO(1, "BAIXADO"),
    ATRASADO(2, "ATRASADO");

    private Integer id;
    private String situacao;

    Situacao(Integer id, String situacao) {
        this.id = id;
        this.situacao = situacao;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }

    public static Situacao toEnum(Integer id) {
        if (id == null) return null;
        for (Situacao situacao : Situacao.values()) {
            if (id.equals(situacao.getId())) {
                return situacao;
            }
        }
        throw new IllegalArgumentException("Situação inválida");
    }

}
