package com.project.domains.enums;

public enum TipoConta {
    CONTACORRENTE(0, "CONTA_CORRENTE"),
    CONTAINVESTIMENTO(1, "CONTA_INVESTIMENTO"),
    CARTAOCREDITO(2, "CARTAO_CREDITO"),
    ALIMENTACAO(3, "ALIMENTACAO"),
    POUPANCA(4, "POUPANCA");

    private Integer id;
    private String tipoConta;

    TipoConta(Integer id, String tipoConta) {
        this.id = id;
        this.tipoConta = tipoConta;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(String tipoConta) {
        this.tipoConta = tipoConta;
    }

    public static TipoConta toEnum(Integer id) {
        if (id == null) return null;
        for (TipoConta tipoConta : TipoConta.values()) {
            if (id.equals(tipoConta.getId())) {
                return tipoConta;
            }
        }
        throw new IllegalArgumentException("Tipo de Conta Inválido");
    }
}
