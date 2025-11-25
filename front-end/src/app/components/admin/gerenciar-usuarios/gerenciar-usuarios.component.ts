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

  // Filtros
  filtroTexto: string = '';
  filtroStatus: string = 'todos';
  filtroTipo: string = 'todos';

  // Paginação
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalItens: number = 0;

  // Modal de edição
  usuarioEditando: Usuario | null = null;
  mostrarModalEdicao: boolean = false;

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

    // Primeiro carrega usuários normais
    this.usuarioService.findAll().subscribe({
      next: (usuariosNormais: any[]) => {
        console.log('✅ Usuários normais carregados:', usuariosNormais.length);
        
        // Depois carrega admins
        this.adminService.findAll().subscribe({
          next: (admins: any[]) => {
            console.log('✅ Admins carregados:', admins.length);
            
            // Combina e processa os dados
            this.processarUsuarios(usuariosNormais, admins);
            this.carregando = false;
          },
          error: (errorAdmin) => {
            console.error('❌ Erro ao carregar admins:', errorAdmin);
            // Se der erro nos admins, usa só os usuários normais
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
    // Processa usuários normais
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

    // Processa admins
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

    // Combina as listas
    this.usuarios = [...usuariosProcessados, ...adminsProcessados];
    this.usuariosFiltrados = [...this.usuarios];
    this.totalItens = this.usuarios.length;

    console.log('👥 Total de usuários carregados:', this.usuarios.length);
  }

  // ✅ NOVO: Gerar ID temporário para evitar undefined
  private gerarIdTemporario(): number {
    return Math.floor(Math.random() * 1000000) * -1; // IDs negativos para temporários
  }

  // ✅ NOVOS MÉTODOS PARA AS ESTATÍSTICAS
  getTotalAdmins(): number {
    return this.usuarios.filter(u => u.isAdmin).length;
  }

  getTotalAtivos(): number {
    return this.usuarios.filter(u => u.status === 1).length;
  }

  getTotalInativos(): number {
    return this.usuarios.filter(u => u.status === 0).length;
  }

  // ✅ MÉTODO PROMOVER PARA ADMIN QUE ESTAVA FALTANDO
  promoverParaAdmin(usuario: Usuario): void {
    if (!usuario.idUsuario) {
      console.error('❌ ID do usuário não encontrado para promoção');
      this.erro = 'ID do usuário não encontrado';
      return;
    }

    this.salvando = true;
    this.erro = '';
    
    console.log('👑 Promovendo usuário para admin:', usuario.nome, 'ID:', usuario.idUsuario);

    // Primeiro tenta usar o endpoint específico de promoção
    this.promoverViaEndpointEspecifico(usuario);
  }

  private promoverViaEndpointEspecifico(usuario: Usuario): void {
    // Tenta usar o endpoint /admin/users/promote/{id}
    this.httpPromote(usuario.idUsuario!).subscribe({
      next: (response: any) => {
        console.log('✅ Usuário promovido com sucesso via endpoint específico:', response);
        this.finalizarPromocao(usuario);
      },
      error: (error: any) => {
        console.log('❌ Endpoint específico falhou, tentando via update...', error);
        // Se o endpoint específico falhar, tenta via update normal
        this.promoverViaUpdate(usuario);
      }
    });
  }

  private promoverViaUpdate(usuario: Usuario): void {
    if (!usuario.idUsuario) {
      this.erro = 'ID do usuário não encontrado';
      this.salvando = false;
      return;
    }

    console.log('🔄 Promovendo via update... ID:', usuario.idUsuario);
    
    // Cria uma cópia das funções atuais e adiciona ADMIN (ID 1)
    const novasFuncoes = [...new Set([...(usuario.funcaoPessoa || []), 1])];
    
    // ✅ CORRIGIDO: Enviar objeto Usuario completo
    const usuarioAtualizacao = {
      idUsuario: usuario.idUsuario,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      status: usuario.status,
      cpf: usuario.cpf,
      datanascimento: usuario.datanascimento,
      dataCriacao: usuario.dataCriacao,
      funcaoPessoa: novasFuncoes
    };

    console.log('📤 Dados de atualização para promoção:', usuarioAtualizacao);

    this.usuarioService.update(usuario.idUsuario, usuarioAtualizacao).subscribe({
      next: (response: any) => {
        console.log('✅ Usuário promovido com sucesso via update:', response);
        this.finalizarPromocao(usuario);
      },
      error: (error: any) => {
        console.error('❌ Erro ao promover via update:', error);
        this.erro = error.error?.message || 'Erro ao promover usuário para admin';
        this.salvando = false;
      }
    });
  }

  private httpPromote(id: number): any {
    // Simula uma chamada HTTP para o endpoint de promoção
    // Você precisará implementar isso no seu AdminService
    return this.adminService.promoteToAdmin(id);
  }

  private finalizarPromocao(usuario: Usuario): void {
    this.salvando = false;
    this.sucesso = `${usuario.nome} foi promovido para Administrador com sucesso!`;
    this.carregarUsuarios(); // Recarrega a lista para refletir a mudança
  }

  // ✅ MÉTODO FINALIZAR EDIÇÃO QUE ESTAVA FALTANDO
  private finalizarEdicao(): void {
    this.salvando = false;
    this.sucesso = 'Usuário atualizado com sucesso!';
    this.fecharModalEdicao();
    this.carregarUsuarios(); // Recarrega a lista para refletir as mudanças
  }

  // ✅ MÉTODO TRATAR ERRO EDIÇÃO QUE ESTAVA FALTANDO
  private tratarErroEdicao(error: any): void {
    this.salvando = false;
    this.erro = error.error?.message || 'Erro ao atualizar usuário';
    console.error('❌ Erro na edição:', error);
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

  // Filtros
  aplicarFiltros(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      // Filtro por texto (nome ou email)
      const textoMatch = !this.filtroTexto || 
        usuario.nome.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.filtroTexto.toLowerCase());

      // Filtro por status
      const statusMatch = this.filtroStatus === 'todos' || 
        (this.filtroStatus === 'ativo' && usuario.status === 1) ||
        (this.filtroStatus === 'inativo' && usuario.status === 0);

      // Filtro por tipo
      const tipoMatch = this.filtroTipo === 'todos' ||
        (this.filtroTipo === 'admin' && usuario.isAdmin) ||
        (this.filtroTipo === 'usuario' && !usuario.isAdmin);

      return textoMatch && statusMatch && tipoMatch;
    });

    this.totalItens = this.usuariosFiltrados.length;
    this.paginaAtual = 1; // Reset para primeira página
  }

  // Paginação
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

  // Modal de edição
  abrirModalEdicao(usuario: Usuario): void {
    this.usuarioEditando = { ...usuario };
    this.mostrarModalEdicao = true;
    this.erro = '';
    this.sucesso = '';
  }

  fecharModalEdicao(): void {
    this.mostrarModalEdicao = false;
    this.usuarioEditando = null;
    this.erro = '';
    this.sucesso = '';
  }

  salvarEdicao(): void {
    if (!this.usuarioEditando) {
      console.log('❌ Nenhum usuário selecionado para edição');
      return;
    }

    this.salvando = true;
    this.erro = '';

    // ✅ CORRIGIDO: Enviar apenas os campos que podem ser atualizados
    const dadosAtualizacao: any = {
      nome: this.usuarioEditando.nome,
      email: this.usuarioEditando.email,
      telefone: this.usuarioEditando.telefone,
      status: this.usuarioEditando.status
    };

    // ✅ CORRIGIDO: Garantir que o ID existe
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
      dados: dadosAtualizacao
    });

    if (this.usuarioEditando.isAdmin) {
      console.log('🔧 Atualizando como Admin...');
      
      // ✅ CORRIGIDO: Para Admin, criar objeto AdminDTO completo
      const adminAtualizacao = {
        idAdmin: id,
        nome: this.usuarioEditando.nome,
        email: this.usuarioEditando.email,
        telefone: this.usuarioEditando.telefone,
        status: this.usuarioEditando.status,
        cpf: this.usuarioEditando.cpf, // Manter CPF original
        datanascimento: this.usuarioEditando.datanascimento, // Manter data original
        dataCriacao: this.usuarioEditando.dataCriacao, // Manter data criação
        funcaoPessoa: this.usuarioEditando.funcaoPessoa // Manter funções
      };
      
      this.adminService.update(id, adminAtualizacao).subscribe({
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
      
      // ✅ CORRIGIDO: Para Usuário, criar objeto UsuarioDTO completo
      const usuarioAtualizacao = {
        idUsuario: id,
        nome: this.usuarioEditando.nome,
        email: this.usuarioEditando.email,
        telefone: this.usuarioEditando.telefone,
        status: this.usuarioEditando.status,
        cpf: this.usuarioEditando.cpf, // Manter CPF original
        datanascimento: this.usuarioEditando.datanascimento, // Manter data original
        dataCriacao: this.usuarioEditando.dataCriacao, // Manter data criação
        funcaoPessoa: this.usuarioEditando.funcaoPessoa // Manter funções
      };
      
      this.usuarioService.update(id, usuarioAtualizacao).subscribe({
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

  // Utilitários para o template
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
    return usuario.isAdmin ? 'Administrador' : 'Usuário';
  }

  getTipoClasse(usuario: Usuario): string {
    return usuario.isAdmin ? 'tipo-admin' : 'tipo-usuario';
  }

  getFuncoesTexto(funcoes: number[]): string {
    if (!funcoes?.length) return 'Usuário';
    const textos: string[] = [];
    if (funcoes.includes(0)) textos.push('Usuário');
    if (funcoes.includes(1)) textos.push('Administrador');
    return textos.join(', ') || 'Nenhuma';
  }
}