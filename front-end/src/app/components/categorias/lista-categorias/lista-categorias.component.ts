import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CategoriaService, Categoria } from '../../../services/categoria.service';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-categorias.component.html',
  styleUrls: ['./lista-categorias.component.css']
})
export class ListaCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  carregando: boolean = true;
  erro: string = '';

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

  editarCategoria(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/categorias/editar', id]);
    }
  }

  deletarCategoria(categoria: Categoria): void {
    if (categoria.idCategoriaLancamento && confirm(`Tem certeza que deseja deletar a categoria "${categoria.descricao}"?`)) {
      this.categoriaService.delete(categoria.idCategoriaLancamento).subscribe({
        next: () => {
          console.log('✅ Categoria deletada');
          this.carregarCategorias();
        },
        error: (error) => {
          alert('Erro ao deletar categoria. Verifique se não há lançamentos vinculados.');
          console.error('❌ Erro:', error);
        }
      });
    }
  }

  // Método para contar quantos lançamentos estão vinculados (mock - você pode implementar depois)
  getQuantidadeLancamentos(categoria: Categoria): number {
    // Por enquanto retorna 0 - você pode implementar isso depois
    return 0;
  }
}