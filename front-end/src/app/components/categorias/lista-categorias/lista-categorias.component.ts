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
  
  termoBusca: string = '';

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
      const buscaMatch = !this.termoBusca || 
        categoria.descricao.toLowerCase().includes(this.termoBusca.toLowerCase());

      return buscaMatch;
    });
  }

  limparFiltros(): void {
    this.termoBusca = '';
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
          if (error.status === 400) {
            this.erro = 'Não é possível deletar a categoria porque existem lançamentos vinculados.';
          } else {
            this.erro = 'Erro ao deletar categoria. Tente novamente.';
          }
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

  getQuantidadeLancamentos(categoria: Categoria): number {

    if (categoria.lancamentos && Array.isArray(categoria.lancamentos)) {
      return categoria.lancamentos.length;
    }
    
    return 0;
  }

  getStatusClasse(categoria: Categoria): string {
    return 'status-active';
  }

  getStatusTexto(categoria: Categoria): string {
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
    console.log('✅ ' + mensagem);
  }
}