import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { CredenciaisDTO, TokenDTO } from '../models/auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  login(credenciais: CredenciaisDTO): Observable<TokenDTO> {
    console.log('🔐 Tentando login na URL:', `${this.API_URL}/login`);
    console.log('📧 Credenciais:', credenciais);
    
    return this.http.post<TokenDTO>(`${this.API_URL}/login`, credenciais)
      .pipe(
        tap(response => {
          console.log('✅ Login bem sucedido! Resposta:', response);
          localStorage.setItem('token', response.token);
          console.log('🔑 Token salvo no localStorage');
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
}