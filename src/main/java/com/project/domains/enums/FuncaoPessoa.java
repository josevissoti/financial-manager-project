package com.project.domains.enums;

public enum FuncaoPessoa {
    USUARIO(0, "USUARIO"),
    ADMIN(1, "ADMIN");

    private Integer id;
    private String funcaoPessoa;

    FuncaoPessoa(Integer id, String funcaoPessoa) {
        this.id = id;
        this.funcaoPessoa = funcaoPessoa;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFuncaoPessoa() {
        return funcaoPessoa;
    }

    public void setFuncaoPessoa(String funcaoPessoa) {
        this.funcaoPessoa = funcaoPessoa;
    }

    private static FuncaoPessoa toEnum(Integer id) {
        if (id == null) return null;
        for (FuncaoPessoa funcaoPessoa : FuncaoPessoa.values()) {
            if (id.equals(funcaoPessoa.getId())) {
                return funcaoPessoa;
            }
        }
        throw new IllegalArgumentException("Função inválida");
    }
}
