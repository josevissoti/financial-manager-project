package com.project.security;

import com.project.domains.Pessoa;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

public class AdminSS implements UserDetails {

    private String username;
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public AdminSS(Pessoa admin) {
        this.username = admin.getEmail();
        this.password = admin.getSenha();
        this.authorities = admin.getFuncaoPessoa().stream()
                .map(x -> new SimpleGrantedAuthority(x.getFuncaoPessoa()))
                .collect(Collectors.toSet());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
