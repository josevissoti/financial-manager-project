package com.project.repositories;

import com.project.domains.Banco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BancoRepository extends JpaRepository<Banco, Integer> {

    Optional<Banco> findByRazaoSocial(String razaosocial);


}
