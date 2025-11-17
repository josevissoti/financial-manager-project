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
  ) { }

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.carregando = true;
    this.erro = '';

    // Primeiro tenta carregar do AuthService
    const usuarioLogado = this.authService.getUsuarioLogado();

    if (usuarioLogado && usuarioLogado.email) {
      // Busca dados completos do usuário pelo email
      this.usuarioService.findByEmail(usuarioLogado.email).subscribe({
        next: (usuarioCompleto) => {
          this.usuario = {
            ...usuarioCompleto,
            datanascimento: this.converterDataParaInput(usuarioCompleto.datanascimento)
          };
          this.usuarioOriginal = { ...this.usuario };
          this.carregando = false;
          console.log('✅ Perfil carregado:', this.usuario);
        },
        error: (error) => {
          console.error('❌ Erro ao carregar perfil completo:', error);
          // Se não conseguir carregar dados completos, usa os básicos
          this.usuario = {
            ...usuarioLogado,
            datanascimento: this.converterDataParaInput(usuarioLogado.datanascimento)
          };
          this.usuarioOriginal = { ...this.usuario };
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
    const dadosAtualizacao: any = {
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
    if (!this.usuario.nome?.trim()) {
      this.erro = 'Nome é obrigatório.';
      return false;
    }

    if (!this.usuario.email?.trim()) {
      this.erro = 'Email é obrigatório.';
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

  // Métodos para máscaras e formatação
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

  formatarCPF(cpf: string): string {
    if (!cpf) return '';

    // Aplica máscara de CPF: 000.000.000-00
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarTelefone(telefone: string): string {
    if (!telefone) return '';
    return telefone; // Já está formatado pela máscara
  }

  formatarData(data: string): string {
    if (!data) return '';

    // Se a data já está no formato dd/MM/yyyy, retorna como está
    if (data.includes('/')) {
      return data;
    }

    // Se está no formato yyyy-MM-dd, converte para dd/MM/yyyy
    const partes = data.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return data;
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
      let dataNascimento: Date;

      if (this.usuario.datanascimento.includes('/')) {
        const partes = this.usuario.datanascimento.split('/');
        dataNascimento = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
      } else {
        dataNascimento = new Date(this.usuario.datanascimento);
      }

      const hoje = new Date();
      let idade = hoje.getFullYear() - dataNascimento.getFullYear();

      const mesAtual = hoje.getMonth();
      const mesNascimento = dataNascimento.getMonth();

      if (mesAtual < mesNascimento ||
        (mesAtual === mesNascimento && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
      }

      return idade;
    } catch (error) {
      return 0;
    }
  }

  getIniciais(): string {
    if (!this.usuario.nome) return 'U';

    return this.usuario.nome
      .split(' ')
      .map((part: string) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getStatusClasse(): string {
    return this.usuario.status === 1 ? 'status-active' : 'status-inactive';
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

  // Métodos para ações
  exportarDados(): void {
    console.log('📤 Exportando dados do usuário...');
    // Implementar lógica de exportação
    alert('Funcionalidade de exportação em desenvolvimento');
  }

  baixarRelatorio(): void {
    console.log('📊 Gerando relatório PDF...');
    // Implementar geração de relatório
    alert('Funcionalidade de relatório em desenvolvimento');
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }
}