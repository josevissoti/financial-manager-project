package com.project.repositories;

import com.project.domains.Conta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContaRepository extends JpaRepository<Conta, Long> {

    @Query("SELECT c FROM Conta c WHERE c.pessoa.idPessoa = :pessoaId")
    List<Conta> findByPessoaId(@Param("pessoaId") Long pessoaId);

    @Query("SELECT c FROM Conta c WHERE c.idConta = :idConta AND c.pessoa.idPessoa = :pessoaId")
    Optional<Conta> findByIdAndPessoaId(@Param("idConta") Long idConta, @Param("pessoaId") Long pessoaId);
}