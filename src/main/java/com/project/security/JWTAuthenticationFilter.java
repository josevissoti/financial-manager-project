package com.project.security;

import com.project.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    public JWTAuthenticationFilter(JWTUtils jwtUtils, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = getTokenFromRequest(request);

        System.out.println("JWT Filter - URL: " + request.getRequestURI());
        System.out.println("JWT Filter - Token recebido: " + (token != null ? token.substring(0, Math.min(20, token.length())) + "..." : "NULL"));
        System.out.println("JWT Filter - Header Authorization: " + request.getHeader("Authorization"));

        if (token != null && jwtUtils.isTokenValid(token)) {
            String username = jwtUtils.getUsername(token);
            System.out.println("JWT Filter - Usuário autenticado: " + username);

            var userDetails = userDetailsService.loadUserByUsername(username);
            var auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);
        } else {
            System.out.println("JWT Filter - Token inválido ou ausente");
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}