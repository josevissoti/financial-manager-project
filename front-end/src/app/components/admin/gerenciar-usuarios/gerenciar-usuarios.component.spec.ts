import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { AdminService } from '../../../services/admin.service';

interface Usuario {
  idUsuario?: number;
  idAdmin?: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  datanascimento: string;
  dataCriacao: string;
  status: number;
  funcaoPessoa: number[];
  isAdmin?: boolean;
}

@Component({
  selector: 'app-gerenciar-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gerenciar-usuarios.component.html',
  styleUrls: ['./gerenciar-usuarios.component.css']
})
export class GerenciarUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  carregando: boolean = true;
  salvando: boolean = false;
  erro: string = '';
  sucesso: string = '';

  filtroTexto: string = '';
  filtroStatus: string = 'todos';
  filtroTipo: string = 'todos';

  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalItens: number = 0;

  usuarioEditando: Usuario | null = null;
  mostrarModalEdicao: boolean = false;
  novaSenha: string = ''; // ✅ NOVO: Campo para nova senha

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.erro = '';

    console.log('📋 Carregando lista de usuários...');

    this.usuarioService.findAll().subscribe({
      next: (usuariosNormais: any[]) => {
        console.log('✅ Usuários normais carregados:', usuariosNormais.length);
        
        this.adminService.findAll().subscribe({
          next: (admins: any[]) => {
            console.log('✅ Admins carregados:', admins.length);
            
            this.processarUsuarios(usuariosNormais, admins);
            this.carregando = false;
          },
          error: (errorAdmin) => {
            console.error('❌ Erro ao carregar admins:', errorAdmin);
            this.processarUsuarios(usuariosNormais, []);
            this.carregando = false;
          }
        });
      },
      error: (errorUsuario) => {
        console.error('❌ Erro ao carregar usuários:', errorUsuario);
        this.erro = 'Erro ao carregar lista de usuários';
        this.carregando = false;
      }
    });
  }

  private processarUsuarios(usuariosNormais: any[], admins: any[]): void {
    const usuariosProcessados = usuariosNormais.map(usuario => ({
      idUsuario: usuario.idUsuario || usuario.idPessoa || this.gerarIdTemporario(),
      nome: usuario.nome || '',
      email: usuario.email || '',
      cpf: usuario.cpf || '',
      telefone: usuario.telefone || '',
      datanascimento: usuario.datanascimento || usuario.dataNascimento || '',
      dataCriacao: usuario.dataCriacao || '',
      status: usuario.status ?? 1,
      funcaoPessoa: this.mapearFuncoesDoBackend(usuario.funcaoPessoa),
      isAdmin: false
    }));

    const adminsProcessados = admins.map(admin => ({
      idAdmin: admin.idAdmin || admin.idPessoa || this.gerarIdTemporario(),
      idUsuario: admin.idAdmin || admin.idPessoa || this.gerarIdTemporario(), // Para compatibilidade
      nome: admin.nome || '',
      email: admin.email || '',
      cpf: admin.cpf || '',
      telefone: admin.telefone || '',
      datanascimento: admin.datanascimento || admin.dataNascimento || '',
      dataCriacao: admin.dataCriacao || '',
      status: admin.status ?? 1,
      funcaoPessoa: this.mapearFuncoesDoBackend(admin.funcaoPessoa),
      isAdmin: true
    }));

    this.usuarios = [...usuariosProcessados, ...adminsProcessados];
    this.usuariosFiltrados = [...this.usuarios];
    this.totalItens = this.usuarios.length;

    console.log('👥 Total de usuários carregados:', this.usuarios.length);
  }

  promoverParaAdmin(usuario: Usuario): void {
    if (!usuario.idUsuario) {
      console.error('❌ ID do usuário não encontrado para promoção');
      this.erro = 'ID do usuário não encontrado';
      return;
    }

    const confirmacao = confirm(`Tem certeza que deseja promover ${usuario.nome} para Administrador?\n\nEsta ação dará a este usuário acesso completo ao sistema.`);
    
    if (!confirmacao) {
      return;
    }

    this.salvando = true;
    this.erro = '';
    
    console.log('👑 Promovendo usuário para admin:', usuario.nome, 'ID:', usuario.idUsuario);

    this.adminService.promoteToAdmin(usuario.idUsuario).subscribe({
      next: (response: any) => {
        console.log('✅ Usuário promovido com sucesso:', response);
        this.salvando = false;
        this.sucesso = `${usuario.nome} foi promovido para Administrador com sucesso!`;
        
        usuario.isAdmin = true;
        usuario.funcaoPessoa = [...(usuario.funcaoPessoa || []), 1];
        
        setTimeout(() => {
          this.carregarUsuarios();
        }, 2000);
      },
      error: (error: any) => {
        console.error('❌ Erro ao promover usuário:', error);
        this.salvando = false;
        this.erro = error.error?.message || 'Erro ao promover usuário para admin';
        
        if (error.status === 400) {
          this.erro = 'Este usuário já é um administrador.';
        } else if (error.status === 404) {
          this.erro = 'Usuário não encontrado.';
        } else {
          this.erro = 'Erro ao promover usuário. Tente novamente.';
        }
      }
    });
  }

  temFuncaoAdmin(usuario: Usuario): boolean {
    return usuario.funcaoPessoa?.includes(1) || false;
  }

  getTotalAdmins(): number {
    return this.usuarios.filter(u => u.isAdmin || this.temFuncaoAdmin(u)).length;
  }

  getTotalAtivos(): number {
    return this.usuarios.filter(u => u.status === 1).length;
  }

  getTotalInativos(): number {
    return this.usuarios.filter(u => u.status === 0).length;
  }

  salvarEdicao(): void {
    if (!this.usuarioEditando) {
      console.log('❌ Nenhum usuário selecionado para edição');
      return;
    }

    if (!this.usuarioEditando.nome || !this.usuarioEditando.email || !this.usuarioEditando.telefone) {
      this.erro = 'Nome, email e telefone são obrigatórios';
      return;
    }

    if (this.novaSenha && this.novaSenha.length < 6) {
      this.erro = 'A senha deve ter pelo menos 6 caracteres';
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dadosAtualizacao: any = {
      nome: this.usuarioEditando.nome,
      email: this.usuarioEditando.email,
      telefone: this.usuarioEditando.telefone,
      status: this.usuarioEditando.status,
      cpf: this.usuarioEditando.cpf,
      datanascimento: this.usuarioEditando.datanascimento,
      dataCriacao: this.usuarioEditando.dataCriacao,
      funcaoPessoa: this.usuarioEditando.funcaoPessoa
    };

    if (this.novaSenha && this.novaSenha.length >= 6) {
      dadosAtualizacao.senha = this.novaSenha;
    }

    const id = this.usuarioEditando.idUsuario || this.usuarioEditando.idAdmin;
    
    if (!id) {
      console.log('❌ ID do usuário não encontrado:', this.usuarioEditando);
      this.erro = 'ID do usuário não encontrado';
      this.salvando = false;
      return;
    }

    console.log('📝 Salvando edição do usuário:', {
      id,
      isAdmin: this.usuarioEditando.isAdmin,
      dados: dadosAtualizacao,
      temNovaSenha: !!this.novaSenha
    });

    if (this.usuarioEditando.isAdmin) {
      console.log('🔧 Atualizando como Admin...');
      
      dadosAtualizacao.idAdmin = id;
      
      this.adminService.update(id, dadosAtualizacao).subscribe({
        next: (response) => {
          console.log('✅ Admin atualizado com sucesso:', response);
          this.finalizarEdicao();
        },
        error: (error: any) => {
          console.error('❌ Erro ao atualizar admin:', error);
          this.tratarErroEdicao(error);
        }
      });
    } else {
      console.log('🔧 Atualizando como Usuário...');
      
      dadosAtualizacao.idUsuario = id;
      
      this.usuarioService.update(id, dadosAtualizacao).subscribe({
        next: (response) => {
          console.log('✅ Usuário atualizado com sucesso:', response);
          this.finalizarEdicao();
        },
        error: (error: any) => {
          console.error('❌ Erro ao atualizar usuário:', error);
          this.tratarErroEdicao(error);
        }
      });
    }
  }

  abrirModalEdicao(usuario: Usuario): void {
    this.usuarioEditando = { ...usuario };
    this.novaSenha = '';
    this.mostrarModalEdicao = true;
    this.erro = '';
    this.sucesso = '';
  }

  fecharModalEdicao(): void {
    this.mostrarModalEdicao = false;
    this.usuarioEditando = null;
    this.novaSenha = '';
    this.erro = '';
    this.sucesso = '';
  }

  private finalizarEdicao(): void {
    this.salvando = false;
    this.sucesso = 'Usuário atualizado com sucesso!';
    this.fecharModalEdicao();
    this.carregarUsuarios();
  }

  private tratarErroEdicao(error: any): void {
    this.salvando = false;
    this.erro = error.error?.message || 'Erro ao atualizar usuário';
    console.error('❌ Erro na edição:', error);
  }

  private gerarIdTemporario(): number {
    return Math.floor(Math.random() * 1000000) * -1;
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

    return [0];
  }

  aplicarFiltros(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const textoMatch = !this.filtroTexto || 
        usuario.nome.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.filtroTexto.toLowerCase());

      const statusMatch = this.filtroStatus === 'todos' || 
        (this.filtroStatus === 'ativo' && usuario.status === 1) ||
        (this.filtroStatus === 'inativo' && usuario.status === 0);

      const tipoMatch = this.filtroTipo === 'todos' ||
        (this.filtroTipo === 'admin' && (usuario.isAdmin || this.temFuncaoAdmin(usuario))) ||
        (this.filtroTipo === 'usuario' && !usuario.isAdmin && !this.temFuncaoAdmin(usuario));

      return textoMatch && statusMatch && tipoMatch;
    });

    this.totalItens = this.usuariosFiltrados.length;
    this.paginaAtual = 1;
  }

  get usuariosPaginados(): Usuario[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.usuariosFiltrados.slice(inicio, fim);
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalItens / this.itensPorPagina);
  }

  mudarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  formatarData(data: string): string {
    if (!data) return 'Não informado';
    if (data.includes('/')) return data;
    const partes = data.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
  }

  formatarCPF(cpf: string): string {
    if (!cpf) return 'Não informado';
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.length === 11 ? cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : cpf;
  }

  getStatusClasse(status: number): string {
    return status === 1 ? 'status-active' : 'status-inactive';
  }

  getStatusTexto(status: number): string {
    return status === 1 ? 'Ativo' : 'Inativo';
  }

  getTipoUsuario(usuario: Usuario): string {
    return (usuario.isAdmin || this.temFuncaoAdmin(usuario)) ? 'Administrador' : 'Usuário';
  }

  getTipoClasse(usuario: Usuario): string {
    return (usuario.isAdmin || this.temFuncaoAdmin(usuario)) ? 'tipo-admin' : 'tipo-usuario';
  }

  getFuncoesTexto(funcoes: number[]): string {
    if (!funcoes?.length) return 'Usuário';
    const textos: string[] = [];
    if (funcoes.includes(0)) textos.push('Usuário');
    if (funcoes.includes(1)) textos.push('Administrador');
    return textos.join(', ') || 'Nenhuma';
  }
}