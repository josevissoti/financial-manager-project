package com.project.services;

import com.project.domains.Pessoa;
import com.project.repositories.PessoaRepository;
import com.project.security.UserSS;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private PessoaRepository pessoaRepository;

    public static Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserSS) {
            UserSS userSS = (UserSS) authentication.getPrincipal();
            return getUserIdByEmail(userSS.getUsername());
        }
        return null;
    }

    public static String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserSS) {
            UserSS userSS = (UserSS) authentication.getPrincipal();
            return userSS.getUsername();
        }
        return null;
    }

    public static boolean isAuthenticatedUserAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserSS) {
            UserSS userSS = (UserSS) authentication.getPrincipal();
            return userSS.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        }
        return false;
    }

    private static Long getUserIdByEmail(String email) {
        return null;
    }

    public Long getUserId() {
        String email = getAuthenticatedUserEmail();
        if (email != null) {
            Optional<Pessoa> pessoa = pessoaRepository.findByEmail(email);
            return pessoa.map(Pessoa::getIdPessoa).orElse(null);
        }
        return null;
    }

    public Pessoa getAuthenticatedPessoa() {
        String email = getAuthenticatedUserEmail();
        if (email != null) {
            Optional<Pessoa> pessoa = pessoaRepository.findByEmail(email);
            return pessoa.orElse(null);
        }
        return null;
    }
}