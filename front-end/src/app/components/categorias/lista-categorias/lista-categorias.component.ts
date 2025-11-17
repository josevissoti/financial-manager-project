import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../../../services/categoria.service';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-categorias.component.html',
  styleUrls: ['./lista-categorias.component.css']
})
export class ListaCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  carregando: boolean = true;
  erro: string = '';
  
  // Filtros
  termoBusca: string = '';
  filtroStatus: string = '';
  filtroLancamentos: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.carregando = true;
    this.erro = '';

    this.categoriaService.findAll().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.categoriasFiltradas = [...categorias];
        this.carregando = false;
        console.log(`✅ ${categorias.length} categorias carregadas`);
      },
      error: (error) => {
        this.erro = 'Erro ao carregar categorias. Tente novamente.';
        this.carregando = false;
        console.error('❌ Erro:', error);
      }
    });
  }

  filtrarCategorias(): void {
    this.categoriasFiltradas = this.categorias.filter(categoria => {
      // Filtro por busca
      const buscaMatch = !this.termoBusca || 
        categoria.descricao.toLowerCase().includes(this.termoBusca.toLowerCase());

      // Filtro por status (assumindo que todas estão ativas por enquanto)
      let statusMatch = true;
      if (this.filtroStatus) {
        // Por enquanto, todas as categorias são consideradas ativas
        // Você pode adicionar um campo de status no backend depois
        const isAtiva = true; // categoria.ativa ou similar
        statusMatch = this.filtroStatus === 'ativa' ? isAtiva : !isAtiva;
      }

      // Filtro por lançamentos
      let lancamentosMatch = true;
      if (this.filtroLancamentos) {
        const temLancamentos = this.getQuantidadeLancamentos(categoria) > 0;
        lancamentosMatch = this.filtroLancamentos === 'com-lancamentos' ? 
          temLancamentos : !temLancamentos;
      }

      return buscaMatch && statusMatch && lancamentosMatch;
    });
  }

  limparFiltros(): void {
    this.termoBusca = '';
    this.filtroStatus = '';
    this.filtroLancamentos = '';
    this.categoriasFiltradas = [...this.categorias];
  }

  editarCategoria(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/categorias/editar', id]);
    }
  }

  deletarCategoria(categoria: Categoria): void {
    const quantidadeLancamentos = this.getQuantidadeLancamentos(categoria);
    
    if (quantidadeLancamentos > 0) {
      alert(`Não é possível deletar a categoria "${categoria.descricao}" porque existem ${quantidadeLancamentos} lançamentos vinculados a ela.`);
      return;
    }

    if (categoria.idCategoriaLancamento && 
        confirm(`Tem certeza que deseja deletar a categoria "${categoria.descricao}"?`)) {
      
      this.categoriaService.delete(categoria.idCategoriaLancamento).subscribe({
        next: () => {
          console.log('✅ Categoria deletada');
          this.mostrarSucesso(`Categoria "${categoria.descricao}" deletada com sucesso!`);
          this.carregarCategorias();
        },
        error: (error) => {
          this.erro = 'Erro ao deletar categoria. Tente novamente.';
          console.error('❌ Erro:', error);
        }
      });
    }
  }

  verLancamentos(categoria: Categoria): void {
    if (categoria.idCategoriaLancamento) {
      this.router.navigate(['/lancamentos'], { 
        queryParams: { categoria: categoria.idCategoriaLancamento } 
      });
    }
  }

  // Método para contar quantos lançamentos estão vinculados (mock - você pode implementar depois)
  getQuantidadeLancamentos(categoria: Categoria): number {
    // Por enquanto retorna um número aleatório para demonstração
    // Você pode implementar isso consultando o serviço de lançamentos
    return Math.floor(Math.random() * 10); // 0-9 lançamentos
  }

  getStatusClasse(categoria: Categoria): string {
    // Por enquanto, todas as categorias são consideradas ativas
    // Você pode adicionar um campo de status no backend
    return 'status-active';
  }

  getStatusTexto(categoria: Categoria): string {
    // Por enquanto, todas as categorias são consideradas ativas
    return 'Ativa';
  }

  getStatusIcon(categoria: Categoria): string {
    return '✅';
  }

  getIniciais(nome: string | undefined): string {
    if (!nome) return 'U';
    
    return nome
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  private mostrarSucesso(mensagem: string): void {
    // Poderia ser um toast notification
    console.log('✅ ' + mensagem);
    // alert(mensagem); // Ou usar um serviço de notificação
  }
}