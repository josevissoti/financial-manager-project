package com.project.domains.enums;

public enum TipoLancamento {
    DEBITO(0, "DEBITO"),
    CREDITO(1, "CREDITO");

    private Integer id;
    private String tipoLancamento;

    TipoLancamento(Integer id, String tipoLancamento) {
        this.id = id;
        this.tipoLancamento = tipoLancamento;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTipoLancamento() {
        return tipoLancamento;
    }

    public void setTipoLancamento(String tipoLancamento) {
        this.tipoLancamento = tipoLancamento;
    }

    public static TipoLancamento toEnum(Integer id) {
        if (id == null) return null;
        for (TipoLancamento tipoLancamento : TipoLancamento.values()) {
            if (id.equals(tipoLancamento.getId())) {
                return tipoLancamento;
            }
        }
        throw new IllegalArgumentException("Tipo de Lançamento Inválido");
    }

}
