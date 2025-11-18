package com.project.services;

import com.project.security.UserSS;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserServiceStatic {

    private static PessoaRepositoryStatic pessoaRepositoryStatic;

    @Autowired
    public UserServiceStatic(PessoaRepositoryStatic pessoaRepositoryStatic) {
        UserServiceStatic.pessoaRepositoryStatic = pessoaRepositoryStatic;
    }

    public static Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserSS) {
            UserSS userSS = (UserSS) authentication.getPrincipal();
            String email = userSS.getUsername();
            return pessoaRepositoryStatic.findIdByEmail(email);
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
}