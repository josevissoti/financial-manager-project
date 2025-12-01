import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, BehaviorSubject, switchMap } from 'rxjs';
import { CredenciaisDTO, TokenDTO } from '../models/auth-data.model';
import { AdminService } from './admin.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/auth';
  private usuarioLogadoSubject = new BehaviorSubject<any>(null);
  public usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private adminService: AdminService,
    private usuarioService: UsuarioService
  ) {
    this.carregarUsuarioDoStorage();
  }

  login(credenciais: CredenciaisDTO): Observable<TokenDTO> {
    console.log('🔐 Tentando login na URL:', `${this.API_URL}/login`);
    console.log('📧 Credenciais:', credenciais);

    return this.http.post<TokenDTO>(`${this.API_URL}/login`, credenciais)
      .pipe(
        switchMap(response => {
          console.log('✅ Login bem sucedido! Resposta:', response);

          let token = response.token;
          if (token.startsWith('Bearer ')) {
            token = token.substring(7);
          }

          localStorage.setItem('token', token);
          console.log('🔑 Token salvo no localStorage');

          return this.buscarUsuarioCompleto(credenciais.username).pipe(
            tap(usuarioCompleto => {
              console.log('👤 Usuário completo carregado:', usuarioCompleto);
              this.salvarDadosUsuario(usuarioCompleto, token);
            })
          );
        }),
        catchError(error => {
          console.error('❌ ERRO no login:', error);
          throw error;
        })
      );
  }

  private buscarUsuarioCompleto(email: string): Observable<any> {
    console.log('🔍 Buscando informações completas do usuário:', email);
    
    return this.adminService.findByEmail(email).pipe(
      catchError(errorAdmin => {
        console.log('❌ Não é admin, tentando como usuário...');
        return this.usuarioService.findByEmail(email);
      })
    );
  }

  private salvarDadosUsuario(usuarioBackend: any, token: string): void {
    console.log('💾 Salvando dados do usuário:', usuarioBackend);
    
    const funcoes = this.converterFuncoesParaNumeros(usuarioBackend.funcaoPessoa);
    const isAdmin = this.verificarSeEhAdmin(funcoes);
    
    const nome = usuarioBackend.nome || usuarioBackend.email?.split('@')[0] || 'Usuário';

    const usuario = {
      email: usuarioBackend.email,
      nome: nome,
      funcaoPessoa: funcoes,
      roles: this.mapearFuncoesParaRoles(funcoes),
      isAdmin: isAdmin,
      tipo: isAdmin ? 'ADMIN' : 'USER',
      idUsuario: usuarioBackend.idUsuario || usuarioBackend.idAdmin || usuarioBackend.idPessoa,
      dadosCompletos: usuarioBackend
    };

    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioLogadoSubject.next(usuario);
    console.log('👤 Dados COMPLETOS do usuário salvos:', usuario);
  }

  private converterFuncoesParaNumeros(funcoes: any): number[] {
    if (!funcoes) return [0];
    
    console.log('🔄 Convertendo funções:', funcoes);
    
    if (Array.isArray(funcoes)) {
      return funcoes.map(funcao => {
        if (typeof funcao === 'number') {
          return funcao;
        } else if (typeof funcao === 'string') {
          switch (funcao.toUpperCase()) {
            case 'ADMIN': return 1;
            case 'USUARIO': return 0;
            case 'USER': return 0;
            default: return 0;
          }
        } else if (typeof funcao === 'object' && funcao !== null) {
          return funcao.id || 0;
        }
        return 0;
      });
    }
    
    return [0];
  }

  private verificarSeEhAdmin(funcoes: number[]): boolean {
    console.log('🔍 Verificando funções para admin:', funcoes);
    
    const isAdmin = Array.isArray(funcoes) && funcoes.includes(1);
    
    console.log('👑 Resultado da verificação de admin:', isAdmin);
    return isAdmin;
  }

  private mapearFuncoesParaRoles(funcoes: number[]): string[] {
    const roles: string[] = [];
    
    funcoes.forEach(funcao => {
      if (funcao === 0) roles.push('ROLE_USER');
      if (funcao === 1) roles.push('ROLE_ADMIN');
    });
    
    return roles;
  }

  isAdmin(): boolean {
    const usuario = this.getUsuarioLogado();
    
    if (!usuario) {
      console.log('🔍 isAdmin: Nenhum usuário logado');
      return false;
    }

    const isAdmin = this.verificarSeEhAdmin(usuario.funcaoPessoa);

    console.log('👑 Verificação de Admin:', {
      email: usuario.email,
      isAdmin: isAdmin,
      funcaoPessoa: usuario.funcaoPessoa
    });

    return isAdmin;
  }

  logout(): void {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioLogadoSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('🔐 Usuário não autenticado: token não encontrado');
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const isValid = Date.now() < exp;
      return isValid;
    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      return false;
    }
  }

  getUserInfo(): any {
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      return JSON.parse(usuarioStorage);
    }
    return null;
  }

  getUsuarioLogado(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  atualizarUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioLogadoSubject.next(usuario);
  }

  private carregarUsuarioDoStorage(): void {
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      this.usuarioLogadoSubject.next(JSON.parse(usuarioStorage));
    }
  }

  debugAdminCheck(): void {
    const token = this.getToken();
    const usuario = this.getUsuarioLogado();
    
    console.log('🔍 DEBUG ADMIN CHECK:');
    console.log('📋 Token existe:', !!token);
    console.log('👤 Usuário logado:', usuario);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🎯 Payload do token:', payload);
      } catch (error) {
        console.error('❌ Erro ao decodificar token:', error);
      }
    }
    
    console.log('👑 Resultado isAdmin():', this.isAdmin());
    console.log('🎯 Funções do usuário:', usuario?.funcaoPessoa);
    console.log('🔍 Verificação detalhada:', this.verificarSeEhAdmin(usuario?.funcaoPessoa));
  }

  debugTokenDetails(): void {
    const token = this.getToken();
    if (token) {
      console.log('🔍 DETALHES COMPLETOS DO TOKEN:');
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('📋 Payload completo:', payload);
        console.log('👤 Subject:', payload.sub);
        console.log('🎯 Roles/Funções:', payload.roles || payload.authorities || payload.funcaoPessoa);
        console.log('📊 Todas as chaves:', Object.keys(payload));
        console.log('👑 É admin (AuthService):', this.isAdmin());
      } catch (error) {
        console.error('❌ Erro ao decodificar token:', error);
      }
    } else {
      console.log('🔍 Nenhum token encontrado');
    }
  }
}