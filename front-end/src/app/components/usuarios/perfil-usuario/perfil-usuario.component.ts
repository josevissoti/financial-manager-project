import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService, Usuario } from '../../../services/usuario.service';
import { AdminService, Admin } from '../../../services/admin.service';
import { PessoaService, Pessoa } from '../../../services/pessoa.service';

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
    private adminService: AdminService,
    private pessoaService: PessoaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.debugTokenDetails();
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.carregando = true;
    this.erro = '';

    // Primeiro tenta carregar do AuthService
    const usuarioLogado = this.authService.getUsuarioLogado();

    if (usuarioLogado && usuarioLogado.email) {
      console.log('👤 USUÁRIO LOGADO COMPLETO:', usuarioLogado);
      console.log('📧 Email:', usuarioLogado.email);
      console.log('👤 Funções:', usuarioLogado.funcaoPessoa);
      console.log('🆔 ID:', usuarioLogado.idUsuario || usuarioLogado.idAdmin || usuarioLogado.idPessoa);
      
      // Verifica se é admin ou usuário comum
      if (this.isAdmin(usuarioLogado)) {
        console.log('🔄 Detectado como ADMIN, tentando carregar...');
        this.carregarAdmin(usuarioLogado.email);
      } else {
        console.log('🔄 Detectado como USUÁRIO, carregando...');
        this.carregarUsuario(usuarioLogado.email);
      }
    } else {
      this.carregando = false;
      this.erro = 'Não foi possível carregar os dados do perfil.';
    }
  }

  private isAdmin(usuario: any): boolean {
    console.log('🔍 Verificando se é admin...');
    console.log('📊 Funções:', usuario.funcaoPessoa);
    
    const funcoes = usuario.funcaoPessoa;
    
    if (!funcoes) return false;
    
    // Converte para array de números para verificação
    const funcoesNumeros = this.mapearFuncoesDoBackend(funcoes);
    console.log('🔢 Funções convertidas:', funcoesNumeros);
    
    const isAdmin = funcoesNumeros.includes(1);
    console.log('✅ É admin?', isAdmin);
    
    return isAdmin;
  }

  private carregarAdmin(email: string): void {
    console.log('🔄 Carregando dados do admin...');
    
    // PRIMEIRO tenta como Admin específico
    this.adminService.findByEmail(email).subscribe({
      next: (adminCompleto: any) => {
        console.log('✅ Dados do ADMIN encontrados:', adminCompleto);
        this.processarUsuario(adminCompleto, true);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar admin específico:', error);
        console.log('🔄 Tentando carregar como PESSOA...');
        // Se não achar como Admin, tenta como Pessoa
        this.carregarPessoa(email);
      }
    });
  }

  private carregarPessoa(email: string): void {
    console.log('🔄 Carregando dados da pessoa...');
    
    this.pessoaService.findByEmail(email).subscribe({
      next: (pessoaCompleta: any) => {
        console.log('✅ Dados da PESSOA encontrados:', pessoaCompleta);
        // Se encontrou como Pessoa, verifica se é admin pelas funções
        const isAdmin = this.verificarAdminPorFuncoes(pessoaCompleta.funcaoPessoa);
        this.processarUsuario(pessoaCompleta, isAdmin);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar pessoa:', error);
        console.log('🔄 Tentando carregar como USUÁRIO...');
        // Último fallback: tenta como Usuário
        this.carregarUsuario(email);
      }
    });
  }

  private verificarAdminPorFuncoes(funcoes: any): boolean {
    const funcoesNumeros = this.mapearFuncoesDoBackend(funcoes);
    return funcoesNumeros.includes(1);
  }

  private carregarUsuario(email: string): void {
    console.log('🔄 Carregando dados do usuário...');
    
    this.usuarioService.findByEmail(email).subscribe({
      next: (usuarioCompleto: any) => {
        console.log('✅ Dados do USUÁRIO encontrados:', usuarioCompleto);
        this.processarUsuario(usuarioCompleto, false);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar usuário completo:', error);
        // Se não conseguir carregar dados completos, usa os básicos do auth
        const usuarioLogado = this.authService.getUsuarioLogado();
        this.processarUsuario(usuarioLogado, false);
      }
    });
  }

  private processarUsuario(dados: any, isAdmin: boolean): void {
    console.log('🔄 Processando dados do usuário:', dados);
    
    // Normaliza os dados para o formato comum
    const usuarioNormalizado = {
      // Dados básicos
      idUsuario: dados.idAdmin || dados.idUsuario || dados.idPessoa,
      nome: dados.nome,
      cpf: dados.cpf,
      datanascimento: this.converterDataParaInput(dados.datanascimento),
      telefone: dados.telefone,
      email: dados.email,
      senha: dados.senha,
      status: dados.status,
      dataCriacao: this.converterDataParaInput(dados.dataCriacao),
      
      // Funções - CORREÇÃO PARA O ENUM
      funcaoPessoa: this.mapearFuncoesDoBackend(dados.funcaoPessoa),
      
      // Flag para identificar tipo
      isAdmin: isAdmin
    };

    this.usuario = usuarioNormalizado;
    this.usuarioOriginal = { ...this.usuario };
    this.carregando = false;
    
    console.log('🎯 Usuário processado FINAL:', this.usuario);
  }

  // MÉTODO CORRIGIDO: Mapeia as funções do backend baseado no enum
  private mapearFuncoesDoBackend(funcoesBackend: any): number[] {
    console.log('🔄 Mapeando funções do backend:', funcoesBackend);
    
    if (!funcoesBackend) return [0]; // Default para usuário
    
    if (Array.isArray(funcoesBackend)) {
      return funcoesBackend.map((funcao: any) => {
        // Se for string (nome da função), converte para ID
        if (typeof funcao === 'string') {
          switch (funcao.toUpperCase()) {
            case 'USUARIO': return 0;
            case 'ADMIN': return 1;
            default: return 0;
          }
        }
        // Se for objeto do enum, pega o ID
        else if (typeof funcao === 'object' && funcao !== null) {
          return funcao.id || 0;
        }
        // Já é número, retorna como está
        else if (typeof funcao === 'number') {
          return funcao;
        }
        return 0;
      });
    }
    
    // Se não for array, converte para array
    if (typeof funcoesBackend === 'number') {
      return [funcoesBackend];
    }
    
    if (typeof funcoesBackend === 'string') {
      return [this.mapearStringParaFuncao(funcoesBackend)];
    }
    
    return [0];
  }

  // Método auxiliar para mapear string para ID da função
  private mapearStringParaFuncao(funcaoString: string): number {
    switch (funcaoString.toUpperCase()) {
      case 'USUARIO': return 0;
      case 'ADMIN': return 1;
      default: return 0;
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

    // Decide qual serviço usar baseado no tipo de usuário
    if (this.usuario.isAdmin) {
      this.atualizarAdmin(dadosAtualizacao);
    } else {
      this.atualizarUsuario(dadosAtualizacao);
    }
  }

  private atualizarUsuario(dadosAtualizacao: any): void {
    if (this.usuario.idUsuario) {
      this.usuarioService.update(this.usuario.idUsuario, dadosAtualizacao).subscribe({
        next: (response) => {
          this.finalizarAtualizacao(response);
        },
        error: (error) => {
          this.tratarErroAtualizacao(error);
        }
      });
    }
  }

  private atualizarAdmin(dadosAtualizacao: any): void {
    if (this.usuario.idUsuario) {
      this.adminService.update(this.usuario.idUsuario, dadosAtualizacao).subscribe({
        next: (response) => {
          this.finalizarAtualizacao(response);
        },
        error: (error) => {
          this.tratarErroAtualizacao(error);
        }
      });
    }
  }

  private finalizarAtualizacao(response: any): void {
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
  }

  private tratarErroAtualizacao(error: any): void {
    this.erro = 'Erro ao atualizar perfil. Tente novamente.';
    this.salvando = false;
    console.error('❌ Erro:', error);
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
    if (!cpf) return 'Não informado';

    // Remove formatação existente e aplica máscara
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) return cpf; // Retorna como está se não for um CPF válido

    // Aplica máscara de CPF: 000.000.000-00
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarTelefone(telefone: string): string {
    if (!telefone) return 'Não informado';
    
    // Se já está formatado, retorna como está
    if (telefone.includes('(') && telefone.includes(')')) {
      return telefone;
    }
    
    // Aplica formatação básica
    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo.length === 11) {
      return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefoneLimpo.length === 10) {
      return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return telefone;
  }

  formatarData(data: string): string {
    if (!data) return 'Não informado';

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
      return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
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
    if (!this.usuario.funcaoPessoa || this.usuario.funcaoPessoa.length === 0) {
      return 'Usuário';
    }

    // Garante que estamos trabalhando com números
    const funcoesNumeros = this.mapearFuncoesDoBackend(this.usuario.funcaoPessoa);
    
    const textos: string[] = [];
    if (funcoesNumeros.includes(0)) textos.push('Usuário');
    if (funcoesNumeros.includes(1)) textos.push('Administrador');

    return textos.join(', ') || 'Nenhuma';
  }
}