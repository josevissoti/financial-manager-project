import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pessoa {
  idPessoa?: number;
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

export interface PessoaDTO {
  idPessoa?: number;
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
export class PessoaService {
  private readonly API_URL = 'http://localhost:8080/pessoa';

  constructor(private http: HttpClient) { }

  /**
   * Buscar pessoa por Email
   */
  findByEmail(email: string): Observable<PessoaDTO> {
    console.log('🔍 Buscando pessoa por email:', email);
    return this.http.get<PessoaDTO>(`${this.API_URL}/email/${email}`);
  }

  /**
   * Buscar pessoa por CPF
   */
  findByCpf(cpf: string): Observable<PessoaDTO> {
    return this.http.get<PessoaDTO>(`${this.API_URL}/cpf/${cpf}`);
  }

  /**
   * Buscar pessoa por ID
   */
  findById(id: number): Observable<PessoaDTO> {
    return this.http.get<PessoaDTO>(`${this.API_URL}/${id}`);
  }

  /**
   * Buscar todas as pessoas
   */
  findAll(): Observable<PessoaDTO[]> {
    return this.http.get<PessoaDTO[]>(this.API_URL);
  }

  /**
   * Atualizar pessoa existente
   */
  update(id: number, pessoa: Pessoa): Observable<Pessoa> {
    console.log('🔄 Atualizando pessoa ID:', id, pessoa);
    
    // Remove máscaras antes de enviar
    const pessoaParaEnviar = {
      ...pessoa,
      cpf: pessoa.cpf.replace(/\D/g, ''),
      telefone: pessoa.telefone.replace(/\D/g, '')
    };
    
    return this.http.put<Pessoa>(`${this.API_URL}/${id}`, pessoaParaEnviar);
  }

  /**
   * Utilitário: Obter texto do status
   */
  getStatusTexto(status: number): string {
    return status === 1 ? 'Ativo' : 'Inativo';
  }

  /**
   * Utilitário: Obter classe CSS para status
   */
  getStatusClasse(status: number): string {
    return status === 1 ? 'badge bg-success' : 'badge bg-danger';
  }

  /**
   * Utilitário: Obter texto das funções
   */
  getFuncoesTexto(funcoes: number[]): string {
    const textos: string[] = [];
    
    if (funcoes.includes(0)) textos.push('Usuário');
    if (funcoes.includes(1)) textos.push('Administrador');
    
    return textos.join(', ') || 'Nenhuma';
  }

  /**
   * Formatar data para exibição
   */
  formatarData(data: string): string {
    if (!data) return '';
    
    if (data.includes('/')) {
      return data;
    }
    
    const partes = data.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return data;
  }
}