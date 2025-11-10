import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, BehaviorSubject } from 'rxjs';
import { CredenciaisDTO, TokenDTO } from '../models/auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/auth';
  private usuarioLogadoSubject = new BehaviorSubject<any>(null);
  public usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(private http: HttpClient) { 
    // Carregar dados do usuário do localStorage ao inicializar
    this.carregarUsuarioDoStorage();
  }

  login(credenciais: CredenciaisDTO): Observable<TokenDTO> {
    console.log('🔐 Tentando login na URL:', `${this.API_URL}/login`);
    console.log('📧 Credenciais:', credenciais);
    
    return this.http.post<TokenDTO>(`${this.API_URL}/login`, credenciais)
      .pipe(
        tap(response => {
          console.log('✅ Login bem sucedido! Resposta:', response);
          
          // ✅ Remove "Bearer " se o backend já incluir
          let token = response.token;
          if (token.startsWith('Bearer ')) {
            token = token.substring(7);
            console.log('🔑 Token limpo (removido Bearer)');
          }
          
          localStorage.setItem('token', token);
          console.log('🔑 Token salvo no localStorage:', token.substring(0, 20) + '...');
          
          // Decodificar token e salvar dados do usuário
          this.salvarDadosUsuarioDoToken(token);
        }),
        catchError(error => {
          console.error('❌ ERRO no login:', error);
          console.log('📋 Detalhes do erro:');
          console.log(' - Status:', error.status);
          console.log(' - Message:', error.message);
          console.log(' - Error body:', error.error);
          throw error;
        })
      );
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
      const exp = payload.exp * 1000; // JWT exp está em segundos
      const isValid = Date.now() < exp;
      
      console.log('🔐 Verificação de autenticação:', {
        tokenExiste: !!token,
        expiracao: new Date(exp),
        agora: new Date(),
        valido: isValid
      });
      
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
    
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('👤 Informações do usuário do token:', payload);
        return payload;
      } catch (error) {
        console.error('❌ Erro ao decodificar token:', error);
        return null;
      }
    }
    return null;
  }

  // Método para debug - mostra informações detalhadas do token
  debugToken(): void {
    const token = this.getToken();
    if (token) {
      console.log('🔍 DEBUG DO TOKEN:');
      console.log(' - Token completo:', token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log(' - Payload decodificado:', payload);
        console.log(' - Expiração:', new Date(payload.exp * 1000));
        console.log(' - Subject:', payload.sub);
      } catch (error) {
        console.error(' - Erro ao decodificar:', error);
      }
    } else {
      console.log('🔍 DEBUG: Nenhum token encontrado');
    }
  }

  // Novo método para obter dados completos do usuário logado
  getUsuarioLogado(): any {
    return this.usuarioLogadoSubject.value;
  }

  // Método para atualizar dados do usuário
  atualizarUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioLogadoSubject.next(usuario);
  }

  // Métodos privados
  private salvarDadosUsuarioDoToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const usuario = {
        email: payload.sub,
        nome: payload.name || payload.sub.split('@')[0],
        // Adicione outros campos que podem estar no token
      };
      
      localStorage.setItem('usuario', JSON.stringify(usuario));
      this.usuarioLogadoSubject.next(usuario);
      console.log('👤 Dados do usuário salvos:', usuario);
    } catch (error) {
      console.error('❌ Erro ao salvar dados do usuário:', error);
    }
  }

  private carregarUsuarioDoStorage(): void {
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      this.usuarioLogadoSubject.next(JSON.parse(usuarioStorage));
    }
  }
}