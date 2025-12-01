import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { AdminService } from '../../../services/admin.service';

interface PerfilUsuario {
  id?: number;
  idUsuario?: number;
  idAdmin?: number;
  nome: string;
  cpf: string;
  datanascimento: string;
  dataCriacao?: string;
  telefone: string;
  email: string;
  senha?: string;
  status: number;
  funcaoPessoa: number[];
  isAdmin?: boolean;
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  usuario: PerfilUsuario = {
    nome: '',
    cpf: '',
    datanascimento: '',
    telefone: '',
    email: '',
    status: 1,
    funcaoPessoa: [],
    isAdmin: false
  };
  
  usuarioOriginal: PerfilUsuario = { ...this.usuario };
  editando: boolean = false;
  carregando: boolean = false;
  salvando: boolean = false;
  erro: string = '';
  sucesso: string = '';

  alterarSenha: boolean = false;
  novaSenha: string = '';
  confirmarSenha: string = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.carregando = true;
    this.erro = '';

    const usuarioLogado = this.authService.getUsuarioLogado();
    const email = usuarioLogado?.email;

    if (!email) {
      this.carregando = false;
      this.erro = 'Email não disponível para carregar o perfil';
      return;
    }

    this.adminService.findByEmail(email).subscribe({
      next: (adminCompleto: any) => {
        this.processarUsuario(adminCompleto, true);
      },
      error: (errorAdmin) => {
        this.usuarioService.findByEmail(email).subscribe({
          next: (usuarioCompleto: any) => {
            this.processarUsuario(usuarioCompleto, false);
          },
          error: (errorUsuario) => {
            this.carregando = false;
            this.erro = `Perfil não encontrado. O email ${email} não está cadastrado como admin nem como usuário.`;
            
            this.processarUsuario(usuarioLogado, false);
          }
        });
      }
    });
  }

  private processarUsuario(dados: any, isAdmin: boolean): void {
    const idPrincipal = this.extrairIdPrincipal(dados, isAdmin);

    const usuarioNormalizado: PerfilUsuario = {
      id: idPrincipal,
      idUsuario: isAdmin ? idPrincipal : (dados.idUsuario || idPrincipal),
      idAdmin: isAdmin ? idPrincipal : undefined,
      nome: dados.nome || '',
      cpf: dados.cpf || '',
      datanascimento: this.converterDataParaInput(dados.datanascimento || dados.dataNascimento),
      telefone: dados.telefone || '',
      email: dados.email || '',
      senha: dados.senha,
      status: dados.status ?? 1,
      dataCriacao: this.converterDataParaInput(dados.dataCriacao),
      funcaoPessoa: this.mapearFuncoesDoBackend(dados.funcaoPessoa),
      isAdmin: isAdmin
    };

    this.usuario = usuarioNormalizado;
    this.usuarioOriginal = { ...this.usuario };
    this.carregando = false;
  }

  private extrairIdPrincipal(dados: any, isAdmin: boolean): number {
    if (isAdmin) {
      return dados.idAdmin || dados.idPessoa || dados.idUsuario || 0;
    }
    return dados.idUsuario || dados.idPessoa || dados.idAdmin || 0;
  }

  private mapearFuncoesDoBackend(funcoesBackend: any): number[] {
    if (!funcoesBackend) return [0];

    if (Array.isArray(funcoesBackend) && funcoesBackend.every(item => typeof item === 'number')) {
      return funcoesBackend;
    }

    if (Array.isArray(funcoesBackend)) {
      return funcoesBackend.map(item => {
        if (typeof item === 'number') return item;
        if (typeof item === 'string') {
          return item.toUpperCase() === 'ADMIN' ? 1 : 0;
        }
        if (typeof item === 'object' && item !== null) {
          return item.id || 0;
        }
        return 0;
      });
    }

    if (funcoesBackend instanceof Set) {
      return this.mapearFuncoesDoBackend(Array.from(funcoesBackend));
    }

    return [0];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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

    if (!this.validarDados()) {
      this.salvando = false;
      return;
    }

    const idParaAtualizar = this.usuario.id || this.usuario.idUsuario || this.usuario.idAdmin;
    
    if (!idParaAtualizar) {
      this.erro = 'ID não encontrado para atualização';
      this.salvando = false;
      return;
    }

    const dadosAtualizacao: any = {
      nome: this.usuario.nome,
      cpf: this.usuario.cpf.replace(/\D/g, ''),
      datanascimento: this.converterDataParaBackend(this.usuario.datanascimento),
      telefone: this.usuario.telefone.replace(/\D/g, ''),
      email: this.usuario.email,
      status: this.usuario.status
    };

    if (this.alterarSenha && this.novaSenha) {
      dadosAtualizacao.senha = this.novaSenha;
    }

    if (this.usuario.isAdmin) {
      this.adminService.update(idParaAtualizar, dadosAtualizacao).subscribe({
        next: (response) => this.finalizarAtualizacao(response),
        error: (error) => this.tratarErroAtualizacao(error)
      });
    } else {
      this.usuarioService.update(idParaAtualizar, dadosAtualizacao).subscribe({
        next: (response) => this.finalizarAtualizacao(response),
        error: (error) => this.tratarErroAtualizacao(error)
      });
    }
  }

  private finalizarAtualizacao(response: any): void {
    this.salvando = false;
    this.editando = false;
    this.alterarSenha = false;
    this.novaSenha = '';
    this.confirmarSenha = '';
    this.sucesso = 'Perfil atualizado com sucesso!';
    
    setTimeout(() => this.carregarPerfil(), 1000);
  }

  private tratarErroAtualizacao(error: any): void {
    this.erro = error.error?.message || 'Erro ao atualizar perfil';
    this.salvando = false;
  }

  validarDados(): boolean {
    if (!this.usuario.nome?.trim()) {
      this.erro = 'Nome é obrigatório';
      return false;
    }
    if (!this.usuario.email?.trim()) {
      this.erro = 'Email é obrigatório';
      return false;
    }
    if (this.alterarSenha) {
      if (!this.novaSenha || this.novaSenha.length < 6) {
        this.erro = 'Senha deve ter pelo menos 6 caracteres';
        return false;
      }
      if (this.novaSenha !== this.confirmarSenha) {
        this.erro = 'Senhas não coincidem';
        return false;
      }
    }
    return true;
  }

  aplicarMascaraTelefone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 2) value = '(' + value;
    else if (value.length <= 6) value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
    else if (value.length <= 10) value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6);
    else value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
    this.usuario.telefone = value;
  }

  aplicarMascaraData(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 2) value = value;
    else if (value.length <= 4) value = value.substring(0, 2) + '/' + value.substring(2);
    else value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
    this.usuario.datanascimento = value;
  }

  formatarCPF(cpf: string): string {
    if (!cpf) return 'Não informado';
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.length === 11 ? cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : cpf;
  }

  formatarTelefone(telefone: string): string {
    if (!telefone) return 'Não informado';
    if (telefone.includes('(') && telefone.includes(')')) return telefone;
    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo.length === 11) return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (telefoneLimpo.length === 10) return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return telefone;
  }

  formatarData(data: string | undefined | null): string {
    if (!data) return 'Não informado';
    if (data.includes('/')) return data;
    const partes = data.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
  }

  private converterDataParaBackend(dataString: string): string {
    if (!dataString) return '';
    const partes = dataString.split('/');
    return partes.length === 3 ? `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}` : dataString;
  }

  private converterDataParaInput(dataString: string): string {
    if (!dataString) return '';
    const partes = dataString.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : dataString;
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
      if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
      }
      return idade;
    } catch (error) {
      return 0;
    }
  }

  getIniciais(): string {
    return this.usuario.nome ? this.usuario.nome.split(' ').map((part: string) => part.charAt(0)).join('').toUpperCase().substring(0, 2) : 'U';
  }

  getStatusClasse(): string {
    return this.usuario.status === 1 ? 'status-active' : 'status-inactive';
  }

  getStatusTexto(): string {
    return this.usuario.status === 1 ? 'Ativo' : 'Inativo';
  }

  getFuncoesTexto(): string {
    if (!this.usuario.funcaoPessoa?.length) return 'Usuário';
    const textos: string[] = [];
    if (this.usuario.funcaoPessoa.includes(0)) textos.push('Usuário');
    if (this.usuario.funcaoPessoa.includes(1)) textos.push('Administrador');
    return textos.join(', ') || 'Nenhuma';
  }
}