package com.project.domains;

import com.project.domains.dtos.AdminDTO;
import com.project.domains.enums.FuncaoPessoa;
import com.project.domains.enums.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.stream.Collectors;

@Entity
@Table(name = "admin")
public class Admin extends Pessoa {

    private static final Logger log = LoggerFactory.getLogger(Admin.class);

    public Admin(Long idPessoa, String nome, String cpf, LocalDate dataNascimento, LocalDate dataCriacao, String telefone, String email, String senha, Status status) {
        super(idPessoa, nome, cpf, dataNascimento, dataCriacao, telefone, email, senha, status);
        addFuncaoPessoa(FuncaoPessoa.USUARIO);
        addFuncaoPessoa(FuncaoPessoa.ADMIN);
    }

    public Admin(AdminDTO dto) {
        this.idPessoa = dto.getIdAdmin();
        this.nome = dto.getNome();
        this.cpf = dto.getCpf();
        this.dataNascimento = dto.getDatanascimento();
        this.dataCriacao = dto.getDataCriacao();
        this.telefone = dto.getTelefone();
        this.email = dto.getEmail();
        this.senha = dto.getSenha();
        this.funcaoPessoa = dto.getFuncaoPessoa().stream()
                .map(x -> x.getId()).collect(Collectors.toSet());
        addFuncaoPessoa(FuncaoPessoa.USUARIO);
        addFuncaoPessoa(FuncaoPessoa.ADMIN);
    }

    public Admin() {
        super();
        addFuncaoPessoa(FuncaoPessoa.USUARIO);
        addFuncaoPessoa(FuncaoPessoa.ADMIN);
    }
}
