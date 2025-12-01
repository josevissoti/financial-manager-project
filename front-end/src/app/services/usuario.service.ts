import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  idUsuario?: number;
  nome: string;
  cpf: string;
  datanascimento: string;
  dataCriacao?: string;
  telefone: string;
  email: string;
  senha?: string;
  status: number;
  funcaoPessoa?: number[];
}

export interface UsuarioDTO {
  idUsuario?: number;
  nome: string;
  cpf: string;
  datanascimento: string;
  dataCriacao?: string;
  telefone: string;
  email: string;
  senha?: string;
  status: number;
  funcaoPessoa: number[];
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly API_URL = 'http://localhost:8080/usuario';

  constructor(private http: HttpClient) { }

  findAll(): Observable<UsuarioDTO[]> {
    console.log('📋 Buscando todos os usuários...');
    return this.http.get<UsuarioDTO[]>(this.API_URL);
  }

  findById(id: number): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.API_URL}/${id}`);
  }

  findByCpf(cpf: string): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.API_URL}/cpf/${cpf}`);
  }

  findByEmail(email: string): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.API_URL}/email/${email}`);
  }

  create(usuario: Usuario): Observable<Usuario> {
    console.log('📝 Criando novo usuário:', usuario);
    
    const usuarioParaEnviar = {
      ...usuario,
      cpf: usuario.cpf.replace(/\D/g, ''),
      telefone: usuario.telefone.replace(/\D/g, '')
    };
    
    return this.http.post<Usuario>(this.API_URL, usuarioParaEnviar);
  }

  update(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, usuario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getStatusTexto(status: number): string {
    return status === 1 ? 'Ativo' : 'Inativo';
  }

  getStatusClasse(status: number): string {
    return status === 1 ? 'badge bg-success' : 'badge bg-danger';
  }

  getFuncoesTexto(funcoes: number[]): string {
    const textos: string[] = [];
    
    if (funcoes.includes(0)) textos.push('Usuário');
    if (funcoes.includes(1)) textos.push('Admin');
    
    return textos.join(', ') || 'Nenhuma';
  }

  formatarData(data: string): string {
    if (!data) return '';
    const partes = data.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return data;
  }
}