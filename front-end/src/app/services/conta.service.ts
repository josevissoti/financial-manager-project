import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Conta {
  idConta: number;
  descricao: string;
  saldo: number;
  limite: number;
  agencia: string;
  numero: string;
  tipoConta: number;
  idPessoa: number;
  idBanco: number;
  nome?: string;
  email?: string;
  razaoSocialBanco?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContaService {
  private readonly API_URL = 'http://localhost:8080/conta';

  constructor(private http: HttpClient) { }

  /**
   * Buscar todas as contas
   */
  findAll(): Observable<Conta[]> {
    console.log('📋 Buscando todas as contas...');
    return this.http.get<Conta[]>(this.API_URL);
  }

  /**
   * Buscar conta por ID
   */
  findById(id: number): Observable<Conta> {
    return this.http.get<Conta>(`${this.API_URL}/${id}`);
  }

  /**
   * Criar nova conta
   */
  create(conta: Conta): Observable<Conta> {
    return this.http.post<Conta>(this.API_URL, conta);
  }

  /**
   * Atualizar conta existente
   */
  update(id: number, conta: Conta): Observable<Conta> {
    return this.http.put<Conta>(`${this.API_URL}/${id}`, conta);
  }

  /**
   * Deletar conta
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Utilitário: Obter texto do tipo de conta
   */
  getTipoContaTexto(tipo: number): string {
    switch (tipo) {
      case 0: return 'Conta Corrente';
      case 1: return 'Conta Investimento';
      case 2: return 'Cartão de Crédito';
      case 3: return 'Alimentação';
      case 4: return 'Poupança';
      default: return 'Desconhecido';
    }
  }

  /**
   * Utilitário: Formatar valor para exibição
   */
  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}