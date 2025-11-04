import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LancamentoService, LancamentoDTO } from '../../../services/lancamento.service';

@Component({
  selector: 'app-lista-lancamentos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-lancamentos.component.html',
  styleUrls: ['./lista-lancamentos.component.css']
})
export class ListaLancamentosComponent implements OnInit {
  lancamentos: LancamentoDTO[] = [];
  carregando: boolean = true;
  erro: string = '';

  // Filtros simples
  filtroDescricao: string = '';
  filtroTipo: string = '';

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

  // Método para filtrar lançamentos
  get lancamentosFiltrados(): LancamentoDTO[] {
    let resultado = this.lancamentos;

    if (this.filtroDescricao) {
      resultado = resultado.filter(l => 
        l.descricao.toLowerCase().includes(this.filtroDescricao.toLowerCase())
      );
    }

    if (this.filtroTipo) {
      const tipo = parseInt(this.filtroTipo);
      resultado = resultado.filter(l => l.tipoLancamento === tipo);
    }

    // Ordenar por data mais recente primeiro
    return resultado.sort((a, b) => 
      new Date(b.dataLancamento).getTime() - new Date(a.dataLancamento).getTime()
    );
  }

  limparFiltros(): void {
    this.filtroDescricao = '';
    this.filtroTipo = '';
  }

  editarLancamento(id: number): void {
    // Por enquanto vamos apenas mostrar um alerta
    alert(`Editar lançamento ${id} - Funcionalidade em desenvolvimento`);
  }

  deletarLancamento(lancamento: LancamentoDTO): void {
    if (confirm(`Tem certeza que deseja deletar o lançamento "${lancamento.descricao}"?`)) {
      this.lancamentoService.delete(lancamento.idLancamento).subscribe({
        next: () => {
          console.log('✅ Lançamento deletado');
          this.carregarLancamentos(); // Recarregar a lista
        },
        error: (error) => {
          alert('Erro ao deletar lançamento');
          console.error('❌ Erro:', error);
        }
      });
    }
  }

  // Métodos auxiliares para o template
  formatarValor(valor: number): string {
    return this.lancamentoService.formatarValor(valor);
  }

  getSituacaoClasse(situacao: number): string {
    return this.lancamentoService.getSituacaoClasse(situacao);
  }

  getSituacaoTexto(situacao: number): string {
    return this.lancamentoService.getSituacaoTexto(situacao);
  }

  getTipoLancamentoIcone(tipo: number): string {
    return this.lancamentoService.getTipoLancamentoIcone(tipo);
  }

  getTipoLancamentoClasse(tipo: number): string {
    return this.lancamentoService.getTipoLancamentoClasse(tipo);
  }

  getTipoLancamentoTexto(tipo: number): string {
    return this.lancamentoService.getTipoLancamentoTexto(tipo);
  }
}