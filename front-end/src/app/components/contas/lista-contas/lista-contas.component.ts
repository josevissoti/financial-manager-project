import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContaService, Conta } from '../../../services/conta.service';

@Component({
  selector: 'app-lista-contas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-contas.component.html',
  styleUrls: ['./lista-contas.component.css']
})
export class ListaContasComponent implements OnInit {
  contas: Conta[] = [];
  contasFiltradas: Conta[] = [];
  carregando: boolean = true;
  erro: string = '';
  
  // Filtros
  termoBusca: string = '';
  filtroTipo: string = '';
  filtroStatus: string = '';

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
        this.contasFiltradas = [...contas];
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

  filtrarContas(): void {
    this.contasFiltradas = this.contas.filter(conta => {
      // Filtro por busca
      const buscaMatch = !this.termoBusca || 
        conta.descricao.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        (conta.razaoSocialBanco && conta.razaoSocialBanco.toLowerCase().includes(this.termoBusca.toLowerCase()));

      // Filtro por tipo
      const tipoMatch = !this.filtroTipo || conta.tipoConta.toString() === this.filtroTipo;

      // Filtro por status
      let statusMatch = true;
      if (this.filtroStatus) {
        switch (this.filtroStatus) {
          case 'positivo':
            statusMatch = conta.saldo >= 0;
            break;
          case 'negativo':
            statusMatch = conta.saldo < 0;
            break;
          case 'limite-alto':
            statusMatch = this.getLimiteUtilizado(conta) >= 70;
            break;
        }
      }

      return buscaMatch && tipoMatch && statusMatch;
    });
  }

  limparFiltros(): void {
    this.termoBusca = '';
    this.filtroTipo = '';
    this.filtroStatus = '';
    this.contasFiltradas = [...this.contas];
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

  verExtrato(conta: Conta): void {
    if (conta.idConta) {
      this.router.navigate(['/lancamentos'], { 
        queryParams: { conta: conta.idConta } 
      });
    }
  }

  fazerTransferencia(conta: Conta): void {
    // Implementar lógica de transferência
    console.log('Iniciar transferência da conta:', conta);
    alert(`Funcionalidade de transferência para ${conta.descricao} em desenvolvimento`);
  }

  formatarValor(valor: number): string {
    return this.contaService.formatarValor(valor);
  }

  getTipoContaTexto(tipo: number): string {
    return this.contaService.getTipoContaTexto(tipo);
  }

  getSaldoClasse(saldo: number): string {
    return saldo >= 0 ? 'positive' : 'negative';
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
      if (utilizacao >= 90) return 'danger';
      if (utilizacao >= 70) return 'warning';
      return 'success';
    }

    // Para outros tipos: alto "preenchimento" é bom (tem bastante dinheiro)
    if (utilizacao >= 70) return 'success';
    if (utilizacao >= 40) return 'info';
    return 'secondary';
  }

  /**
   * ✅ NOVO: Texto descritivo para o limite
   */
  getLimiteTexto(conta: Conta): string {
    const utilizacao = this.getLimiteUtilizado(conta);

    if (conta.tipoConta === 2) {
      // Cartão de crédito
      if (utilizacao === 0) return 'Limite Disponível';
      if (utilizacao >= 90) return 'Limite Quase Esgotado';
      if (utilizacao >= 70) return 'Limite Alto Utilizado';
      return 'Limite Parcialmente Utilizado';
    }

    if (conta.tipoConta === 0 && conta.saldo < 0) {
      // Cheque especial
      if (utilizacao >= 90) return 'Cheque Especial Quase Esgotado';
      if (utilizacao >= 70) return 'Cheque Especial Alto Utilizado';
      return 'Cheque Especial Utilizado';
    }

    // Outros tipos
    if (utilizacao >= 70) return 'Meta Quase Atingida';
    if (utilizacao >= 40) return 'Boa Economia';
    return 'Começando a Economizar';
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
      return `Utilizado: ${this.formatarValor(utilizado)}`;
    }

    if (conta.tipoConta === 0 && conta.saldo < 0) {
      // Cheque especial
      const utilizado = Math.abs(conta.saldo);
      const disponivel = Math.max(conta.limite - utilizado, 0);
      return `Utilizado: ${this.formatarValor(utilizado)}`;
    }

    // Outros tipos
    return `Saldo: ${this.formatarValor(conta.saldo)}`;
  }

  /**
   * ✅ NOVO: Status do limite com emoji
   */
  getLimiteStatusTexto(conta: Conta): string {
    const utilizacao = this.getLimiteUtilizado(conta);

    if (conta.tipoConta === 2 || (conta.tipoConta === 0 && conta.saldo < 0)) {
      if (utilizacao >= 90) return '⚠️ Atenção: Limite quase esgotado';
      if (utilizacao >= 70) return '🔶 Cuidado: Uso elevado do limite';
      if (utilizacao >= 30) return '✅ Uso moderado do limite';
      return '🟢 Limite sob controle';
    }

    // Para metas de economia
    if (utilizacao >= 90) return '🎉 Meta quase atingida!';
    if (utilizacao >= 70) return '🚀 Excelente progresso';
    if (utilizacao >= 40) return '📈 Boa evolução';
    return '🌱 Começando bem';
  }

  /**
   * ✅ NOVO: Classe para o status do limite
   */
  getLimiteStatusClasse(conta: Conta): string {
    const utilizacao = this.getLimiteUtilizado(conta);

    if (conta.tipoConta === 2 || (conta.tipoConta === 0 && conta.saldo < 0)) {
      if (utilizacao >= 90) return 'status-danger';
      if (utilizacao >= 70) return 'status-warning';
      if (utilizacao >= 30) return 'status-info';
      return 'status-success';
    }

    if (utilizacao >= 70) return 'status-success';
    if (utilizacao >= 40) return 'status-info';
    return 'status-secondary';
  }
}