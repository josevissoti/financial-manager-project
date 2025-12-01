import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LancamentoService, Lancamento } from '../../../services/lancamento.service';

@Component({
  selector: 'app-lista-lancamentos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-lancamentos.component.html',
  styleUrls: ['./lista-lancamentos.component.css']
})
export class ListaLancamentosComponent implements OnInit {
  lancamentos: Lancamento[] = [];
  lancamentosFiltrados: Lancamento[] = [];
  carregando: boolean = true;
  erro: string = '';

  filtroDescricao: string = '';
  filtroTipo: string = 'todos';

  constructor(
    private lancamentoService: LancamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarLancamentos();
  }

  carregarLancamentos(): void {
    this.carregando = true;
    this.erro = '';

    this.lancamentoService.findAll().subscribe({
      next: (lancamentos) => {
        this.lancamentos = lancamentos;
        this.lancamentosFiltrados = lancamentos;
        this.carregando = false;
        console.log(`✅ ${lancamentos.length} lançamentos carregados`);
      },
      error: (error) => {
        this.erro = 'Erro ao carregar lançamentos. Tente novamente.';
        this.carregando = false;
        console.error('❌ Erro:', error);
      }
    });
  }

  aplicarFiltros(): void {
    this.lancamentosFiltrados = this.lancamentos.filter(lancamento => {
      const descricaoMatch = lancamento.descricao.toLowerCase().includes(this.filtroDescricao.toLowerCase());
      
      let tipoMatch = true;
      if (this.filtroTipo !== 'todos') {
        tipoMatch = lancamento.tipoLancamento === Number(this.filtroTipo);
      }
      
      return descricaoMatch && tipoMatch;
    });
  }

  limparFiltros(): void {
    this.filtroDescricao = '';
    this.filtroTipo = 'todos';
    this.lancamentosFiltrados = this.lancamentos;
  }

  editarLancamento(lancamento: Lancamento): void {
    if (lancamento.idLancamento) {
      this.router.navigate(['/lancamentos/editar', lancamento.idLancamento]);
    } else {
      console.error('❌ ID do lançamento é undefined para edição');
      alert('Erro: ID do lançamento não encontrado para edição.');
    }
  }

  deletarLancamento(lancamento: Lancamento): void {
    if (lancamento.idLancamento && confirm(`Tem certeza que deseja deletar o lançamento "${lancamento.descricao}"?`)) {
      this.lancamentoService.delete(lancamento.idLancamento).subscribe({
        next: () => {
          console.log('✅ Lançamento deletado');
          this.carregarLancamentos();
        },
        error: (error) => {
          alert('Erro ao deletar lançamento. Verifique se não há dependências.');
          console.error('❌ Erro:', error);
        }
      });
    } else if (!lancamento.idLancamento) {
      console.error('❌ ID do lançamento é undefined');
      alert('Erro: ID do lançamento não encontrado.');
    }
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarData(data: string): string {
    if (!data) return '';
    
    const partes = data.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return data;
  }

  getTipoLancamentoTexto(tipo: number): string {
    switch(tipo) {
      case 0: return '📤 Débito';
      case 1: return '📥 Crédito';
      default: return 'Desconhecido';
    }
  }

  getTipoLancamentoIcone(tipo: number): string {
    switch(tipo) {
      case 0: return '📤';
      case 1: return '📥';
      default: return '❓';
    }
  }

  getSituacaoTexto(situacao: number): string {
    switch(situacao) {
      case 0: return '⏳ Pendente';
      case 1: return '✅ Baixado';
      case 2: return '❌ Atrasado';
      default: return 'Desconhecida';
    }
  }

  getSituacaoClasse(situacao: number): string {
    switch(situacao) {
      case 0: return 'text-warning';
      case 1: return 'text-success';
      case 2: return 'text-danger';
      default: return 'text-muted';
    }
  }

  getTipoClasse(tipo: number): string {
    switch(tipo) {
      case 0: return 'text-danger';
      case 1: return 'text-success';
      default: return 'text-muted';
    }
  }

  getTipoLancamentoClasse(tipo: number): string {
    return this.getTipoClasse(tipo);
  }

  trackByLancamentoId(index: number, lancamento: Lancamento): number {
    return lancamento.idLancamento || index;
  }
}