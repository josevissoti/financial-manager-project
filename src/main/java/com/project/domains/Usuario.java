package com.project.domains;

import com.project.domains.dtos.UsuarioDTO;
import com.project.domains.enums.FuncaoPessoa;
import com.project.domains.enums.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.stream.Collectors;

@Entity
@Table(name = "usuario")
public class Usuario extends Pessoa {

    public Usuario(Long idPessoa, String nome, String cpf, LocalDate dataNascimento, LocalDate dataCriacao, String telefone, String email, String senha, Status status) {
        super(idPessoa, nome, cpf, dataNascimento, dataCriacao, telefone, email, senha, status);
        addFuncaoPessoa(FuncaoPessoa.USUARIO);
    }

    public Usuario(UsuarioDTO dto) {
        this.idPessoa = dto.getIdUsuario();
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
    }

    public Usuario() {
        super();
        addFuncaoPessoa(FuncaoPessoa.USUARIO);
    }
}
