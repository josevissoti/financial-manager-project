import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Conta {
  idConta?: number;
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

  findAll(): Observable<Conta[]> {
    console.log('📋 Buscando todas as contas...');
    return this.http.get<Conta[]>(this.API_URL);
  }

  findById(id: number): Observable<Conta> {
    return this.http.get<Conta>(`${this.API_URL}/${id}`);
  }

  create(conta: Conta): Observable<Conta> {
    return this.http.post<Conta>(this.API_URL, conta);
  }

  update(id: number, conta: Conta): Observable<Conta> {
    return this.http.put<Conta>(`${this.API_URL}/${id}`, conta);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

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

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}