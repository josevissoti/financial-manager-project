import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService, UsuarioDTO } from '../../../services/usuario.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: UsuarioDTO[] = [];
  carregando: boolean = true;
  erro: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.erro = '';

    this.usuarioService.findAll().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.carregando = false;
        console.log(`✅ ${usuarios.length} usuários carregados`);
      },
      error: (error) => {
        this.erro = 'Erro ao carregar usuários. Tente novamente.';
        this.carregando = false;
        console.error('❌ Erro:', error);
      }
    });
  }

  editarUsuario(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/usuarios/editar', id]);
    }
  }

  deletarUsuario(usuario: UsuarioDTO): void {
    if (usuario.idUsuario && confirm(`Tem certeza que deseja deletar o usuário "${usuario.nome}"?`)) {
      this.usuarioService.delete(usuario.idUsuario).subscribe({
        next: () => {
          console.log('✅ Usuário deletado');
          this.carregarUsuarios();
        },
        error: (error) => {
          alert('Erro ao deletar usuário. Verifique se não há dados vinculados.');
          console.error('❌ Erro:', error);
        }
      });
    }
  }

  // Métodos auxiliares para o template
  getStatusTexto(status: number): string {
    return this.usuarioService.getStatusTexto(status);
  }

  getStatusClasse(status: number): string {
    return this.usuarioService.getStatusClasse(status);
  }

  getFuncoesTexto(funcoes: number[]): string {
    return this.usuarioService.getFuncoesTexto(funcoes);
  }

  formatarData(data: string): string {
    return this.usuarioService.formatarData(data);
  }

  // Método para calcular idade (aproximada)
  calcularIdade(dataNascimento: string): number {
    if (!dataNascimento) return 0;
    
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || 
        (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }
}