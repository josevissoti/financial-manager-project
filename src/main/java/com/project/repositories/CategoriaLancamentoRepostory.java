package com.project.repositories;

import com.project.domains.CategoriaLancamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaLancamentoRepostory extends JpaRepository<CategoriaLancamento, Long> {

    @Query("SELECT c FROM CategoriaLancamento c WHERE c.pessoa.idPessoa = :pessoaId")
    List<CategoriaLancamento> findByPessoaId(@Param("pessoaId") Long pessoaId);

    @Query("SELECT c FROM CategoriaLancamento c WHERE c.idCategoriaLancamento = :idCategoria AND c.pessoa.idPessoa = :pessoaId")
    Optional<CategoriaLancamento> findByIdAndPessoaId(@Param("idCategoria") Long idCategoria, @Param("pessoaId") Long pessoaId);
}