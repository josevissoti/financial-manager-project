package com.project.repositories;

import com.project.domains.CategoriaLancamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaLancamentoRepostory extends JpaRepository<CategoriaLancamento, Long> {
}
