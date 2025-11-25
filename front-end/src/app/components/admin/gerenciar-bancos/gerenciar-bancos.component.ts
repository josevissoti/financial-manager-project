import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BancoService, Banco, NovoBanco } from '../../../services/banco.service';

@Component({
  selector: 'app-gerenciar-bancos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gerenciar-bancos.component.html',
  styleUrls: ['./gerenciar-bancos.component.css']
})
export class GerenciarBancosComponent implements OnInit {
  bancos: Banco[] = [];
  bancosFiltrados: Banco[] = [];
  carregando: boolean = true;
  salvando: boolean = false;
  erro: string = '';
  sucesso: string = '';

  // Filtros
  filtroTexto: string = '';
  filtroStatus: string = 'todos';

  // Paginação
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalItens: number = 0;

  // Modal de criação/edição
  bancoEditando: Banco | NovoBanco | null = null;
  mostrarModal: boolean = false;

  // Modal de confirmação de exclusão
  bancoParaExcluir: Banco | null = null;
  mostrarModalConfirmacao: boolean = false;

  constructor(
    private bancoService: BancoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarBancos();
  }

  carregarBancos(): void {
    this.carregando = true;
    this.erro = '';

    console.log('🏛️ Carregando lista de bancos...');

    this.bancoService.findAll().subscribe({
      next: (bancos: Banco[]) => {
        console.log('✅ Bancos carregados:', bancos.length);
        this.bancos = bancos;
        this.bancosFiltrados = [...this.bancos];
        this.totalItens = this.bancos.length;
        this.carregando = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar bancos:', error);
        this.erro = 'Erro ao carregar lista de bancos';
        this.carregando = false;
      }
    });
  }

  // ✅ MÉTODOS PARA AS ESTATÍSTICAS
  getTotalAtivos(): number {
    return this.bancos.filter(b => b.status === 1).length;
  }

  getTotalInativos(): number {
    return this.bancos.filter(b => b.status === 0).length;
  }

  // Filtros
  aplicarFiltros(): void {
    this.bancosFiltrados = this.bancos.filter(banco => {
      // Filtro por texto (razão social)
      const textoMatch = !this.filtroTexto || 
        banco.razaoSocial.toLowerCase().includes(this.filtroTexto.toLowerCase());

      // Filtro por status
      const statusMatch = this.filtroStatus === 'todos' || 
        (this.filtroStatus === 'ativo' && banco.status === 1) ||
        (this.filtroStatus === 'inativo' && banco.status === 0);

      return textoMatch && statusMatch;
    });

    this.totalItens = this.bancosFiltrados.length;
    this.paginaAtual = 1; // Reset para primeira página
  }

  // Paginação
  get bancosPaginados(): Banco[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.bancosFiltrados.slice(inicio, fim);
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalItens / this.itensPorPagina);
  }

  mudarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  // Modal de criação/edição
  abrirModalCriacao(): void {
    this.bancoEditando = {
      razaoSocial: '',
      status: 1
    };
    this.mostrarModal = true;
    this.erro = '';
    this.sucesso = '';
  }

  abrirModalEdicao(banco: Banco): void {
    this.bancoEditando = { ...banco };
    this.mostrarModal = true;
    this.erro = '';
    this.sucesso = '';
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.bancoEditando = null;
    this.erro = '';
    this.sucesso = '';
  }

  salvarBanco(): void {
    if (!this.bancoEditando || !this.bancoEditando.razaoSocial.trim()) {
      this.erro = 'Razão social é obrigatória';
      return;
    }

    this.salvando = true;
    this.erro = '';

    const bancoParaSalvar = {
      ...this.bancoEditando,
      razaoSocial: this.bancoEditando.razaoSocial.trim()
    };

    console.log('💾 Salvando banco:', bancoParaSalvar);

    // ✅ VERIFICA SE É EDIÇÃO OU CRIAÇÃO
    if (this.isBancoComId(bancoParaSalvar)) {
      // Edição
      this.bancoService.update(bancoParaSalvar.idBanco, bancoParaSalvar).subscribe({
        next: (response) => {
          console.log('✅ Banco atualizado com sucesso:', response);
          this.finalizarOperacao('Banco atualizado com sucesso!');
        },
        error: (error: any) => {
          console.error('❌ Erro ao atualizar banco:', error);
          this.tratarErroOperacao(error, 'atualizar');
        }
      });
    } else {
      // Criação
      this.bancoService.create(bancoParaSalvar).subscribe({
        next: (response) => {
          console.log('✅ Banco criado com sucesso:', response);
          this.finalizarOperacao('Banco criado com sucesso!');
        },
        error: (error: any) => {
          console.error('❌ Erro ao criar banco:', error);
          this.tratarErroOperacao(error, 'criar');
        }
      });
    }
  }

  // ✅ MÉTODO AUXILIAR para verificar se é um Banco com ID
  private isBancoComId(banco: any): banco is Banco {
    return (banco as Banco).idBanco !== undefined;
  }

  // ✅ MÉTODO para verificar se é edição (para o template)
  isEdicao(): boolean {
    return this.bancoEditando !== null && this.isBancoComId(this.bancoEditando);
  }

  // ✅ MÉTODO para obter o ID do banco (se existir)
  getIdBanco(): number | null {
    return this.isEdicao() ? (this.bancoEditando as Banco).idBanco : null;
  }

  // Modal de confirmação de exclusão
  confirmarExclusao(banco: Banco): void {
    this.bancoParaExcluir = banco;
    this.mostrarModalConfirmacao = true;
    this.erro = '';
    this.sucesso = '';
  }

  fecharModalConfirmacao(): void {
    this.mostrarModalConfirmacao = false;
    this.bancoParaExcluir = null;
    this.erro = '';
    this.sucesso = '';
  }

  excluirBanco(): void {
    if (!this.bancoParaExcluir?.idBanco) {
      this.erro = 'ID do banco não encontrado';
      return;
    }

    this.salvando = true;
    this.erro = '';

    console.log('🗑️ Excluindo banco:', this.bancoParaExcluir.idBanco);

    this.bancoService.delete(this.bancoParaExcluir.idBanco).subscribe({
      next: () => {
        console.log('✅ Banco excluído com sucesso');
        this.finalizarOperacao('Banco excluído com sucesso!');
        this.fecharModalConfirmacao();
      },
      error: (error: any) => {
        console.error('❌ Erro ao excluir banco:', error);
        this.tratarErroOperacao(error, 'excluir');
        this.fecharModalConfirmacao();
      }
    });
  }

  // Métodos auxiliares para operações
  private finalizarOperacao(mensagemSucesso: string): void {
    this.salvando = false;
    this.sucesso = mensagemSucesso;
    this.fecharModal();
    this.carregarBancos(); // Recarrega a lista para refletir as mudanças
  }

  private tratarErroOperacao(error: any, operacao: string): void {
    this.salvando = false;
    this.erro = error.error?.message || `Erro ao ${operacao} banco`;
    console.error(`❌ Erro na ${operacao}:`, error);
  }

  // Utilitários para o template
  getIniciais(razaoSocial: string): string {
    if (!razaoSocial) return 'B';
    
    const palavras = razaoSocial.split(' ');
    if (palavras.length === 1) {
      return palavras[0].charAt(0).toUpperCase();
    }
    
    return (palavras[0].charAt(0) + palavras[palavras.length - 1].charAt(0)).toUpperCase();
  }

  getStatusClasse(status: number): string {
    return status === 1 ? 'status-active' : 'status-inactive';
  }

  getStatusTexto(status: number): string {
    return status === 1 ? 'Ativo' : 'Inativo';
  }
}