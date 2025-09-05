package com.project.services;

import com.project.domains.Conta;
import com.project.domains.Lancamento;
import com.project.domains.dtos.LancamentoDTO;
import com.project.domains.enums.TipoLancamento;
import com.project.repositories.ContaRepository;
import com.project.repositories.LancamentoRepository;
import com.project.services.exceptions.DataIntegrityViolationException;
import com.project.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LancamentoService {

    @Autowired
    private LancamentoRepository lancamentoRepository;

    @Autowired
    private ContaRepository contaRepository;

    public List<LancamentoDTO> findAll() {
        return lancamentoRepository.findAll().stream()
                .map(obj -> new LancamentoDTO(obj))
                .collect(Collectors.toList());
    }

    public Lancamento findById(Long id) {
        Optional<Lancamento> obj = lancamentoRepository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado. ID: " + id));
    }

    public Lancamento create(LancamentoDTO objDto) {
        objDto.setIdLancamento(null);
        Lancamento newObj = new Lancamento(objDto);

        Conta conta = contaRepository.findById(objDto.getIdConta())
                .orElseThrow(() -> new ObjectNotFoundException("Conta não encontrada. ID: " + objDto.getIdConta()));
        atualizarSaldoConta(conta, newObj);

        contaRepository.save(conta);
        return lancamentoRepository.save(newObj);
    }

    public Lancamento update(Long id, LancamentoDTO objDto) {
        objDto.setIdLancamento(id);
        Lancamento oldObj = findById(id);

        Conta contaOld = oldObj.getConta();
        reverterSaldoConta(contaOld, oldObj);

        oldObj = new Lancamento(objDto);
        Conta contaNew = contaRepository.findById(objDto.getIdConta())
                .orElseThrow(() -> new ObjectNotFoundException("Conta não encontrada. ID: " + objDto.getIdConta()));
        atualizarSaldoConta(contaNew, oldObj);

        contaRepository.save(contaOld);
        contaRepository.save(contaNew);

        return lancamentoRepository.save(oldObj);
    }

    public void delete(Long id) {
        Lancamento lancamento = findById(id);
        Conta conta = lancamento.getConta();
        reverterSaldoConta(conta, lancamento);
        contaRepository.save(conta);
        lancamentoRepository.deleteById(id);
    }

    public void atualizarSaldoConta(Conta conta, Lancamento lancamento) {
        BigDecimal valor = lancamento.getValor();
        if (lancamento.getTipoLancamento() == TipoLancamento.CREDITO) {
            conta.setSaldo(conta.getSaldo().add(valor));
        } else if (lancamento.getTipoLancamento() == TipoLancamento.DEBITO) {
            if (conta.getSaldo().compareTo(valor) >= 0) {
                conta.setSaldo(conta.getSaldo().subtract(valor));
            } else {
                throw new DataIntegrityViolationException("Saldo insuficiente na conta");
            }
        }
    }

    public void reverterSaldoConta(Conta conta, Lancamento lancamento) {
        BigDecimal valor = lancamento.getValor();

        if (lancamento.getTipoLancamento() == TipoLancamento.CREDITO) {
            conta.setSaldo(conta.getSaldo().subtract(valor));
        } else if (lancamento.getTipoLancamento() == TipoLancamento.DEBITO) {
            conta.setSaldo(conta.getSaldo().add(valor));
        }
    }

}
