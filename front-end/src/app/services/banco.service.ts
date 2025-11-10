import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Banco {
  idBanco: number;
  razaoSocial: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class BancoService {
  private readonly API_URL = 'http://localhost:8080/banco';

  constructor(private http: HttpClient) { }

  /**
   * Buscar todos os bancos
   */
  findAll(): Observable<Banco[]> {
    console.log('📋 Buscando todos os bancos...');
    return this.http.get<Banco[]>(this.API_URL);
  }

  /**
   * Buscar banco por ID
   */
  findById(id: number): Observable<Banco> {
    return this.http.get<Banco>(`${this.API_URL}/${id}`);
  }

  /**
   * Criar novo banco
   */
  create(banco: Banco): Observable<Banco> {
    return this.http.post<Banco>(this.API_URL, banco);
  }

  /**
   * Atualizar banco existente
   */
  update(id: number, banco: Banco): Observable<Banco> {
    return this.http.put<Banco>(`${this.API_URL}/${id}`, banco);
  }

  /**
   * Deletar banco
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}