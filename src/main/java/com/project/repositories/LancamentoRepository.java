package com.project.repositories;

import com.project.domains.Lancamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LancamentoRepository extends JpaRepository<Lancamento, Long> {

    @Query("SELECT l FROM Lancamento l WHERE l.pessoa.idPessoa = :pessoaId")
    List<Lancamento> findByPessoaId(@Param("pessoaId") Long pessoaId);

    @Query("SELECT l FROM Lancamento l WHERE l.idLancamento = :idLancamento AND l.pessoa.idPessoa = :pessoaId")
    Optional<Lancamento> findByIdAndPessoaId(@Param("idLancamento") Long idLancamento, @Param("pessoaId") Long pessoaId);
}