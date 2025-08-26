package com.project.repositories;

import com.project.domains.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByCpf(String cpf);
    Optional<Admin> findByEmail(String email);

}
