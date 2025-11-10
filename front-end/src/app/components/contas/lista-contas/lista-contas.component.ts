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
  ) {}

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
      },
      error: (error) => {
        this.erro = 'Erro ao carregar contas. Tente novamente.';
        this.carregando = false;
        console.error('❌ Erro:', error);
      }
    });
  }

  editarConta(id: number | undefined): void { // ✅ Aceita undefined
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

  getLimiteUtilizado(conta: Conta): number {
    if (conta.limite === 0) return 0;
    return ((conta.limite - Math.max(conta.saldo, 0)) / conta.limite) * 100;
  }

  getLimiteClasse(conta: Conta): string {
    const utilizacao = this.getLimiteUtilizado(conta);
    if (utilizacao >= 80) return 'bg-danger';
    if (utilizacao >= 60) return 'bg-warning';
    return 'bg-success';
  }
}