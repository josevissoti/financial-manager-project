import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  idCategoriaLancamento?: number;
  descricao: string;
  idPessoa: number;
  nome?: string;
  email?: string;
  lancamentos?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly API_URL = 'http://localhost:8080/categorialancamento';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Categoria[]> {
    console.log('📋 Buscando todas as categorias...');
    return this.http.get<Categoria[]>(this.API_URL);
  }

  findById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.API_URL}/${id}`);
  }

  create(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.API_URL, categoria);
  }

  update(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.API_URL}/${id}`, categoria);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}