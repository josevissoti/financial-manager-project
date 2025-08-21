package com.project.domains.enums;

public enum Status {
    INATIVO(0, "INATIVO"),
    ATIVO(1, "ATIVO");

    private Integer id;
    private String status;

    Status(Integer id, String status) {
        this.id = id;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public static Status toEnum(Integer id) {
        if (id == null) return null;
        for (Status status : Status.values()) {
            if (id.equals(status.getId())) {
                return status;
            }
        }
        throw new IllegalArgumentException("Status inválido");
    }
}
