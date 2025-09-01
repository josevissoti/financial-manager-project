package com.project.services;

import com.project.domains.*;
import com.project.domains.enums.Situacao;
import com.project.domains.enums.Status;
import com.project.domains.enums.TipoConta;
import com.project.domains.enums.TipoLancamento;
import com.project.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;

@Service
public class DBService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BancoRepository bancoRepository;

    @Autowired
    private CategoriaLancamentoRepostory categoriaLancamentoRepostory;

    @Autowired
    private ContaRepository contaRepository;

    @Autowired
    private LancamentoRepository lancamentoRepository;

    @Autowired
    private PasswordEncoder encoder;

    public void initDB() {

        Banco banco01 = new Banco(
                null,
                "Santander",
                Status.ATIVO
        );
        Banco banco02 = new Banco(
                null,
                "Banco do Brasil",
                Status.ATIVO
        );
        Banco banco03 = new Banco(
                null,
                "Bradesco",
                Status.ATIVO
        );

        Usuario usuario01 = new Usuario(
                null,
                "Manuel Rodrigues",
                "18728009045",
                LocalDate.of(1990, Month.MAY, 15),
                LocalDate.now(),
                "(17)99387-3018",
                "manuel@gmaill.com",
                encoder.encode("manuel123"),
                Status.ATIVO
        );
        Usuario usuario02 = new Usuario(
                null,
                "Leticia Serra",
                "05013538017",
                LocalDate.of(2001, Month.NOVEMBER, 2),
                LocalDate.now(),
                "(17)99864-3254",
                "leticia@gmaill.com",
                encoder.encode("leticia123"),
                Status.ATIVO
        );

        Admin admin01 = new Admin(
                null,
                "Carlos Gomes",
                "25754647069",
                LocalDate.of(1973, Month.AUGUST, 18),
                LocalDate.now(),
                "(17)997183-0916",
                "carlos@gmail.com",
                encoder.encode("carlos123"),
                Status.ATIVO
        );
        Admin admin02 = new Admin(
                null,
                "Renata Carvalho",
                "45420910071",
                LocalDate.of(1959, Month.DECEMBER, 29),
                LocalDate.now(),
                "(17)996972-8433",
                "renata@gmail.com",
                encoder.encode("renata123"),
                Status.ATIVO
        );

        Conta conta01 = new Conta(
                null,
                "Conta Corrente",
                new BigDecimal("50000.00"),
                new BigDecimal("10000.00"),
                "4728",
                "281",
                TipoConta.CONTACORRENTE,
                usuario01,
                banco01
        );
        Conta conta02 = new Conta(
                null,
                "Conta Investimento",
                new BigDecimal("10000.00"),
                new BigDecimal("20000.00"),
                "9572",
                "321",
                TipoConta.CONTAINVESTIMENTO,
                usuario01,
                banco02
        );
        Conta conta03 = new Conta(
                null,
                "Poupança Família",
                new BigDecimal("40000.00"),
                new BigDecimal("5000.00"),
                "9651", "972",
                TipoConta.POUPANCA,
                usuario02,
                banco03
        );

        CategoriaLancamento categoriaLancamento01 = new CategoriaLancamento(
                null,
                "Salário",
                usuario01
        );
        CategoriaLancamento categoriaLancamento02 = new CategoriaLancamento(
                null,
                "Compras",
                usuario01
        );
        CategoriaLancamento categoriaLancamento03 = new CategoriaLancamento(
                null,
                "Aluguel",
                usuario02
        );

        Lancamento lancamento01 = new Lancamento(
                null,
                "Recebimento Salário Agosto/2025",
                new BigDecimal("15000.00"),
                1,
                LocalDate.now(),
                LocalDate.of(2025, Month.AUGUST, 30),
                LocalDate.of(2025, Month.AUGUST, 24),
                TipoLancamento.CREDITO,
                Situacao.BAIXADO,
                usuario01,
                categoriaLancamento01,
                conta01
        );
        Lancamento lancamento02 = new Lancamento(
                null,
                "Compras Mês",
                new BigDecimal("1200.00"),
                3,
                LocalDate.now(),
                LocalDate.of(2025, Month.SEPTEMBER, 25),
                LocalDate.of(2025, Month.SEPTEMBER, 23),
                TipoLancamento.DEBITO,
                Situacao.PENDENTE,
                usuario01,
                categoriaLancamento02,
                conta01
        );
        Lancamento lancamento03 = new Lancamento(
                null,
                "Pagamento Aluguel Apartamento",
                new BigDecimal("800.00"),
                1,
                LocalDate.now(),
                LocalDate.of(2025, Month.AUGUST, 30),
                LocalDate.of(2025, Month.SEPTEMBER, 2),
                TipoLancamento.DEBITO,
                Situacao.ATRASADO,
                usuario02,
                categoriaLancamento03,
                conta03
        );

        bancoRepository.save(banco01);
        bancoRepository.save(banco02);
        bancoRepository.save(banco03);

        adminRepository.save(admin01);
        adminRepository.save(admin02);

        usuarioRepository.save(usuario01);
        usuarioRepository.save(usuario02);

        contaRepository.save(conta01);
        contaRepository.save(conta02);
        contaRepository.save(conta03);

        categoriaLancamentoRepostory.save(categoriaLancamento01);
        categoriaLancamentoRepostory.save(categoriaLancamento02);
        categoriaLancamentoRepostory.save(categoriaLancamento03);

        lancamentoRepository.save(lancamento01);
        lancamentoRepository.save(lancamento02);
        lancamentoRepository.save(lancamento03);
    }

}
