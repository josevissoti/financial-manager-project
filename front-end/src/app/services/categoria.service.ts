import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  idCategoriaLancamento: number;
  descricao: string;
  idPessoa: number;
  nome?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly API_URL = 'http://localhost:8080/categorialancamento';

  constructor(private http: HttpClient) { }

  /**
   * Buscar todas as categorias
   */
  findAll(): Observable<Categoria[]> {
    console.log('📋 Buscando todas as categorias...');
    return this.http.get<Categoria[]>(this.API_URL);
  }

  /**
   * Buscar categoria por ID
   */
  findById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.API_URL}/${id}`);
  }

  /**
   * Criar nova categoria
   */
  create(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.API_URL, categoria);
  }

  /**
   * Atualizar categoria existente
   */
  update(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.API_URL}/${id}`, categoria);
  }

  /**
   * Deletar categoria
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}