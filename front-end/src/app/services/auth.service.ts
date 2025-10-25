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
    return !!this.getToken();
  }
}