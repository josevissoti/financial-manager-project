import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../../../services/categoria.service';

@Component({
  selector: 'app-form-categoria',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './form-categoria.component.html',
  styleUrls: ['./form-categoria.component.css']
})
export class FormCategoriaComponent implements OnInit {
  categoria: Categoria = {
    descricao: '',
    idPessoa: 1
  };


  isEditando: boolean = false;
  carregando: boolean = false;
  enviando: boolean = false;
  erro: string = '';

  categoriasSugeridas = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Vestuário',
    'Beleza',
    'Casa',
    'Tecnologia',
    'Viagens',
    'Investimentos',
    'Doações',
    'Seguros',
    'Serviços'
  ];

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditando = true;
      this.carregarCategoria(Number(id));
    }
  }

  carregarCategoria(id: number): void {
    this.carregando = true;
    
    this.categoriaService.findById(id).subscribe({
      next: (categoria) => {
        this.categoria = categoria;
        this.carregando = false;
        console.log('✅ Categoria carregada para edição:', categoria);
      },
      error: (error) => {
        this.erro = 'Erro ao carregar categoria para edição.';
        this.carregando = false;
        console.error('❌ Erro:', error);
      }
    });
  }

  onSubmit(): void {
    this.enviando = true;
    this.erro = '';

    if (!this.categoria.descricao) {
      this.erro = 'Por favor, informe a descrição da categoria.';
      this.enviando = false;
      return;
    }

    if (this.categoria.descricao.length < 2) {
      this.erro = 'A descrição da categoria deve ter pelo menos 2 caracteres.';
      this.enviando = false;
      return;
    }

    const categoriaParaEnviar: Categoria = {
      ...this.categoria
    };

    console.log('📤 Enviando categoria:', categoriaParaEnviar);

    if (this.isEditando && this.categoria.idCategoriaLancamento) {
      this.categoriaService.update(this.categoria.idCategoriaLancamento, categoriaParaEnviar).subscribe({
        next: (response) => {
          console.log('✅ Categoria atualizada:', response);
          this.enviando = false;
          this.mostrarSucesso('Categoria atualizada com sucesso!');
          this.router.navigate(['/categorias']);
        },
        error: (error) => {
          this.erro = 'Erro ao atualizar categoria. Tente novamente.';
          this.enviando = false;
          console.error('❌ Erro:', error);
        }
      });
    } else {
      this.categoriaService.create(categoriaParaEnviar).subscribe({
        next: (response) => {
          console.log('✅ Categoria criada:', response);
          this.enviando = false;
          this.mostrarSucesso('Categoria criada com sucesso!');
          this.router.navigate(['/categorias']);
        },
        error: (error) => {
          this.erro = 'Erro ao criar categoria. Tente novamente.';
          this.enviando = false;
          console.error('❌ Erro:', error);
        }
      });
    }
  }

  salvarERepetir(): void {
    this.enviando = true;
    this.erro = '';

    if (!this.categoria.descricao) {
      this.erro = 'Por favor, informe a descrição da categoria.';
      this.enviando = false;
      return;
    }

    const categoriaParaEnviar: Categoria = {
      ...this.categoria
    };

    this.categoriaService.create(categoriaParaEnviar).subscribe({
      next: (response) => {
        console.log('✅ Categoria criada:', response);
        this.enviando = false;
        this.mostrarSucesso('Categoria criada com sucesso!');
        
        this.categoria = {
          descricao: '',
          idPessoa: 1
        };
      },
      error: (error) => {
        this.erro = 'Erro ao criar categoria. Tente novamente.';
        this.enviando = false;
        console.error('❌ Erro:', error);
      }
    });
  }

  sugerirCategoria(): void {
    const sugestaoAleatoria = this.categoriasSugeridas[
      Math.floor(Math.random() * this.categoriasSugeridas.length)
    ];
    this.categoria.descricao = sugestaoAleatoria;
  }

  limparFormulario(): void {
    this.categoria = {
      descricao: '',
      idPessoa: 1
    };
    this.erro = '';
  }

  voltar(): void {
    this.router.navigate(['/categorias']);
  }

  private mostrarSucesso(mensagem: string): void {
    console.log('✅ ' + mensagem);
  }
}