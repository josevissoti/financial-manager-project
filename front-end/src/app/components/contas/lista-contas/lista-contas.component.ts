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

        contas.forEach(conta => {
          console.log(`Conta: ${conta.descricao}`, {
            tipoConta: conta.tipoConta,
            tipoTexto: this.getTipoContaTexto(conta.tipoConta),
            banco: conta.razaoSocialBanco
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
      const buscaMatch = !this.termoBusca || 
        conta.descricao.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        (conta.razaoSocialBanco && conta.razaoSocialBanco.toLowerCase().includes(this.termoBusca.toLowerCase())) ||
        this.getTipoContaTexto(conta.tipoConta).toLowerCase().includes(this.termoBusca.toLowerCase());

      const tipoMatch = !this.filtroTipo || conta.tipoConta.toString() === this.filtroTipo;

      let statusMatch = true;
      if (this.filtroStatus) {
        switch (this.filtroStatus) {
          case 'positivo':
            statusMatch = conta.saldo >= 0;
            break;
          case 'negativo':
            statusMatch = conta.saldo < 0;
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

  formatarValor(valor: number): string {
    return this.contaService.formatarValor(valor);
  }

  getTipoContaTexto(tipo: number): string {
    const tipos = {
      0: 'Conta Corrente',
      1: 'Conta Investimento',
      2: 'Cartão de Crédito',
      3: 'Alimentação',
      4: 'Poupança'
    };
    return tipos[tipo as keyof typeof tipos] || 'Desconhecido';
  }

formatarNumeroConta(numero: string, tipoConta: number): string {
  if (!numero) return '';
  
  const numeros = numero.replace(/\D/g, '');
  
  if (tipoConta === 2) {
    if (numeros.length === 0) return '';
    if (numeros.length <= 4) return numeros;
    if (numeros.length <= 8) return `${numeros.slice(0, 4)} ${numeros.slice(4)}`;
    if (numeros.length <= 12) return `${numeros.slice(0, 4)} ${numeros.slice(4, 8)} ${numeros.slice(8)}`;
    if (numeros.length <= 16) return `${numeros.slice(0, 4)} ${numeros.slice(4, 8)} ${numeros.slice(8, 12)} ${numeros.slice(12, 16)}`;
    return `${numeros.slice(0, 4)} ${numeros.slice(4, 8)} ${numeros.slice(8, 12)} ${numeros.slice(12, 16)}`;
  }
  
  if (numeros.length === 0) return '';
  if (numeros.length <= 5) {
    return numeros;
  }
  return `${numeros.slice(0, 5)}-${numeros.slice(5, 6)}`;
}

  getSaldoClasse(saldo: number): string {
    return saldo >= 0 ? 'positive' : 'negative';
  }

  getLimiteUtilizado(conta: Conta): number {
    if (conta.limite <= 0) return 0;

    const tipo = conta.tipoConta;

    if (tipo === 2) {
      const utilizado = Math.max(-conta.saldo, 0);
      return Math.min((utilizado / conta.limite) * 100, 100);
    }

    if (tipo === 0 && conta.saldo < 0) {
      const utilizado = Math.abs(conta.saldo);
      return Math.min((utilizado / conta.limite) * 100, 100);
    }

    return 0;
  }

  getLimiteClasse(conta: Conta): string {
    const utilizacao = this.getLimiteUtilizado(conta);

    if (conta.tipoConta === 2 || (conta.tipoConta === 0 && conta.saldo < 0)) {
      if (utilizacao >= 90) return 'danger';
      if (utilizacao >= 70) return 'warning';
      if (utilizacao >= 30) return 'info';
      return 'success';
    }

    return 'secondary';
  }

  getLimiteTexto(conta: Conta): string {
    const utilizacao = this.getLimiteUtilizado(conta);

    if (conta.tipoConta === 2) {
      if (utilizacao === 0) return 'Limite Disponível';
      if (utilizacao >= 90) return 'Limite Quase Esgotado';
      if (utilizacao >= 70) return 'Limite Alto Utilizado';
      return 'Limite Utilizado';
    }

    if (conta.tipoConta === 0 && conta.saldo < 0) {
      if (utilizacao >= 90) return 'Cheque Especial Quase Esgotado';
      if (utilizacao >= 70) return 'Cheque Especial Alto Utilizado';
      return 'Cheque Especial Utilizado';
    }

    return 'Limite';
  }

  getLimiteDetalhe(conta: Conta): string {
    const utilizacao = this.getLimiteUtilizado(conta);

    if (conta.tipoConta === 2) {
      const utilizado = Math.max(-conta.saldo, 0);
      return `Utilizado: ${this.formatarValor(utilizado)}`;
    }

    if (conta.tipoConta === 0 && conta.saldo < 0) {
      const utilizado = Math.abs(conta.saldo);
      return `Utilizado: ${this.formatarValor(utilizado)}`;
    }

    return `Saldo: ${this.formatarValor(conta.saldo)}`;
  }
}