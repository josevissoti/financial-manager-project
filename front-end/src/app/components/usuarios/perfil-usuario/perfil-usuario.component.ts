import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService, Usuario } from '../../../services/usuario.service';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  usuario: any = {};
  usuarioOriginal: any = {};
  editando: boolean = false;
  carregando: boolean = false;
  salvando: boolean = false;
  erro: string = '';
  sucesso: string = '';

  // Para alteração de senha
  alterarSenha: boolean = false;
  novaSenha: string = '';
  confirmarSenha: string = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.carregando = true;
    
    // Primeiro tenta carregar do AuthService
    const usuarioLogado = this.authService.getUsuarioLogado();
    
    if (usuarioLogado && usuarioLogado.email) {
      // Busca dados completos do usuário pelo email
      this.usuarioService.findByEmail(usuarioLogado.email).subscribe({
        next: (usuarioCompleto) => {
          this.usuario = { ...usuarioCompleto };
          this.usuarioOriginal = { ...usuarioCompleto };
          this.carregando = false;
          console.log('✅ Perfil carregado:', this.usuario);
        },
        error: (error) => {
          console.error('❌ Erro ao carregar perfil completo:', error);
          // Se não conseguir carregar dados completos, usa os básicos
          this.usuario = { ...usuarioLogado };
          this.usuarioOriginal = { ...usuarioLogado };
          this.carregando = false;
        }
      });
    } else {
      this.carregando = false;
      this.erro = 'Não foi possível carregar os dados do perfil.';
    }
  }

  iniciarEdicao(): void {
    this.editando = true;
    this.erro = '';
    this.sucesso = '';
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.alterarSenha = false;
    this.novaSenha = '';
    this.confirmarSenha = '';
    this.usuario = { ...this.usuarioOriginal };
    this.erro = '';
    this.sucesso = '';
  }

  salvarPerfil(): void {
    this.salvando = true;
    this.erro = '';
    this.sucesso = '';

    // Validações
    if (!this.validarDados()) {
      this.salvando = false;
      return;
    }

    // Preparar dados para envio
    const dadosAtualizacao: Usuario = {
      nome: this.usuario.nome,
      cpf: this.usuario.cpf,
      datanascimento: this.converterDataParaBackend(this.usuario.datanascimento),
      telefone: this.usuario.telefone,
      email: this.usuario.email,
      status: this.usuario.status
    };

    // Se está alterando a senha, inclui no envio
    if (this.alterarSenha && this.novaSenha) {
      dadosAtualizacao.senha = this.novaSenha;
    }

    console.log('📤 Atualizando perfil:', dadosAtualizacao);

    if (this.usuario.idUsuario) {
      this.usuarioService.update(this.usuario.idUsuario, dadosAtualizacao).subscribe({
        next: (response) => {
          console.log('✅ Perfil atualizado:', response);
          this.salvando = false;
          this.editando = false;
          this.alterarSenha = false;
          this.novaSenha = '';
          this.confirmarSenha = '';
          
          // Atualiza no AuthService
          this.authService.atualizarUsuario(response);
          
          this.sucesso = 'Perfil atualizado com sucesso!';
          this.carregarPerfil(); // Recarrega os dados
        },
        error: (error) => {
          this.erro = 'Erro ao atualizar perfil. Tente novamente.';
          this.salvando = false;
          console.error('❌ Erro:', error);
        }
      });
    }
  }

  validarDados(): boolean {
    // Validações básicas
    if (!this.usuario.nome || !this.usuario.email) {
      this.erro = 'Nome e email são obrigatórios.';
      return false;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.email)) {
      this.erro = 'Por favor, informe um email válido.';
      return false;
    }

    // Validação de senha se estiver alterando
    if (this.alterarSenha) {
      if (!this.novaSenha || this.novaSenha.length < 6) {
        this.erro = 'A nova senha deve ter pelo menos 6 caracteres.';
        return false;
      }

      if (this.novaSenha !== this.confirmarSenha) {
        this.erro = 'As senhas não coincidem.';
        return false;
      }
    }

    return true;
  }

  // Métodos para máscaras
  aplicarMascaraTelefone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 2) {
      value = '(' + value;
    } else if (value.length <= 6) {
      value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
    } else if (value.length <= 10) {
      value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6);
    } else {
      value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
    }
    
    this.usuario.telefone = value;
  }

  aplicarMascaraData(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 2) {
      value = value;
    } else if (value.length <= 4) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    } else {
      value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
    }
    
    this.usuario.datanascimento = value;
  }

  // Métodos auxiliares
  private converterDataParaBackend(dataString: string): string {
    if (!dataString) return '';
    
    // Converte de "dd/MM/yyyy" para "yyyy-MM-dd"
    const partes = dataString.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return dataString;
  }

  private converterDataParaInput(dataString: string): string {
    if (!dataString) return '';
    
    // Converte de "yyyy-MM-dd" para "dd/MM/yyyy"
    const partes = dataString.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataString;
  }

  calcularIdade(): number {
    if (!this.usuario.datanascimento) return 0;
    
    try {
      const partes = this.usuario.datanascimento.split('/');
      const nascimento = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      
      const mesAtual = hoje.getMonth();
      const mesNascimento = nascimento.getMonth();
      
      if (mesAtual < mesNascimento || 
          (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      
      return idade;
    } catch (error) {
      return 0;
    }
  }

  getStatusTexto(): string {
    return this.usuario.status === 1 ? 'Ativo' : 'Inativo';
  }

  getFuncoesTexto(): string {
    if (!this.usuario.funcaoPessoa) return 'Usuário';
    
    const textos: string[] = [];
    if (this.usuario.funcaoPessoa.includes(0)) textos.push('Usuário');
    if (this.usuario.funcaoPessoa.includes(1)) textos.push('Administrador');
    
    return textos.join(', ') || 'Nenhuma';
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }
}