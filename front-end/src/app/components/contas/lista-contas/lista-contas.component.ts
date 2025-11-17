import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ContaService, Conta } from '../../../services/conta.service';

@Component({
  selector: 'app-lista-contas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-contas.component.html',
  styleUrls: ['./lista-contas.component.css']
})
export class ListaContasComponent implements OnInit {
  contas: Conta[] = [];
  carregando: boolean = true;
  erro: string = '';

  constructor(
    private contaService: ContaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarContas();
  }

  carregarContas(): void {
    this.carregando = true;
    this.erro = '';

    this.contaService.findAll().subscribe({
      next: (contas) => {
        this.contas = contas;
        this.carregando = false;
        console.log(`✅ ${contas.length} contas carregadas`);

        // Debug: verificar cálculos
        contas.forEach(conta => {
          console.log(`Conta: ${conta.descricao}`, {
            saldo: conta.saldo,
            limite: conta.limite,
            limiteUtilizado: this.getLimiteUtilizado(conta),
            tipoConta: this.getTipoContaTexto(conta.tipoConta)
          });
        });
      },
      error: (error) => {
        this.erro = 'Erro ao carregar contas. Tente novamente.';
        this.carregando = false;
        console.error('❌ Erro:', error);
      }
    });
  }

  editarConta(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/contas/editar', id]);
    }
  }

  deletarConta(conta: Conta): void {
    if (conta.idConta && confirm(`Tem certeza que deseja deletar a conta "${conta.descricao}"?`)) {
      this.contaService.delete(conta.idConta).subscribe({
        next: () => {
          console.log('✅ Conta deletada');
          this.carregarContas();
        },
        error: (error) => {
          alert('Erro ao deletar conta. Verifique se não há lançamentos vinculados.');
          console.error('❌ Erro:', error);
        }
      });
    }
  }

  formatarValor(valor: number): string {
    return this.contaService.formatarValor(valor);
  }

  getTipoContaTexto(tipo: number): string {
    return this.contaService.getTipoContaTexto(tipo);
  }

  getSaldoClasse(saldo: number): string {
    return saldo >= 0 ? 'text-success' : 'text-danger';
  }

  /**
   * ✅ CORRIGIDO: Cálculo do limite utilizado
   * Para cartão de crédito e cheque especial: mostra quanto do limite já foi utilizado
   * Para outros tipos: mostra disponibilidade baseada no saldo
   */
  getLimiteUtilizado(conta: Conta): number {
    if (conta.limite <= 0) return 0;

    const tipo = conta.tipoConta;

    // Cartão de Crédito (ID 2) - Limite é o total disponível
    if (tipo === 2) {
      // Para cartão: limite utilizado = (limite - saldo disponível) / limite
      // Saldo negativo indica quanto já foi gasto
      const utilizado = Math.max(-conta.saldo, 0);
      return Math.min((utilizado / conta.limite) * 100, 100);
    }

    // Cheque Especial (Conta Corrente com limite) - ID 0
    // Para conta corrente: limite utilizado quando saldo é negativo
    if (tipo === 0 && conta.saldo < 0) {
      const utilizado = Math.abs(conta.saldo);
      return Math.min((utilizado / conta.limite) * 100, 100);
    }

    // Para outros tipos (poupança, investimento): mostra disponibilidade baseada no saldo
    // Quanto do limite já foi "preenchido" com saldo positivo
    if (conta.saldo > 0) {
      return Math.min((conta.saldo / conta.limite) * 100, 100);
    }

    return 0;
  }

  /**
   * ✅ MELHORADO: Classes para a barra de progresso
   */
  getLimiteClasse(conta: Conta): string {
    const utilizacao = this.getLimiteUtilizado(conta);

    // Cartão de crédito e cheque especial: alto uso é perigoso
    if (conta.tipoConta === 2 || (conta.tipoConta === 0 && conta.saldo < 0)) {
      if (utilizacao >= 90) return 'bg-danger';
      if (utilizacao >= 70) return 'bg-warning';
      return 'bg-success';
    }

    // Para outros tipos: alto "preenchimento" é bom (tem bastante dinheiro)
    if (utilizacao >= 70) return 'bg-success';
    if (utilizacao >= 40) return 'bg-info';
    return 'bg-secondary';
  }

  /**
   * ✅ NOVO: Texto descritivo para o limite
   */
  getLimiteTexto(conta: Conta): string {
    const utilizacao = this.getLimiteUtilizado(conta);

    if (conta.tipoConta === 2) {
      // Cartão de crédito
      if (utilizacao === 0) return 'Limite total disponível';
      if (utilizacao >= 90) return 'Limite quase esgotado!';
      if (utilizacao >= 70) return 'Limite alto utilizado';
      return 'Limite parcialmente utilizado';
    }

    if (conta.tipoConta === 0 && conta.saldo < 0) {
      // Cheque especial
      if (utilizacao >= 90) return 'Cheque especial quase esgotado!';
      if (utilizacao >= 70) return 'Cheque especial alto utilizado';
      return 'Cheque especial utilizado';
    }

    // Outros tipos
    if (utilizacao >= 70) return 'Meta quase atingida';
    if (utilizacao >= 40) return 'Boa economia';
    return 'Começando a economizar';
  }

  /**
 * ✅ NOVO: Detalhe específico do limite
 */
  getLimiteDetalhe(conta: Conta): string {
    const utilizacao = this.getLimiteUtilizado(conta);

    if (conta.tipoConta === 2) {
      // Cartão de crédito
      const utilizado = Math.max(-conta.saldo, 0);
      const disponivel = Math.max(conta.limite - utilizado, 0);
      return `Utilizado: ${this.formatarValor(utilizado)} | Disponível: ${this.formatarValor(disponivel)}`;
    }

    if (conta.tipoConta === 0 && conta.saldo < 0) {
      // Cheque especial
      const utilizado = Math.abs(conta.saldo);
      const disponivel = Math.max(conta.limite - utilizado, 0);
      return `Utilizado: ${this.formatarValor(utilizado)} | Disponível: ${this.formatarValor(disponivel)}`;
    }

    // Outros tipos
    return `Saldo: ${this.formatarValor(conta.saldo)} | Meta: ${this.formatarValor(conta.limite)}`;
  }
}