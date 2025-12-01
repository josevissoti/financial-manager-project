import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Banco {
  idBanco: number;
  razaoSocial: string;
  status: number;
}

export interface NovoBanco {
  razaoSocial: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class BancoService {
  private readonly API_URL = 'http://localhost:8080/banco';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Banco[]> {
    console.log('📋 Buscando todos os bancos...');
    return this.http.get<Banco[]>(this.API_URL);
  }

  findById(id: number): Observable<Banco> {
    return this.http.get<Banco>(`${this.API_URL}/${id}`);
  }

  findByRazaoSocial(razaoSocial: string): Observable<Banco> {
    return this.http.get<Banco>(`${this.API_URL}/razaosocial/${razaoSocial}`);
  }

  create(banco: NovoBanco): Observable<Banco> {
    console.log('📝 Criando novo banco:', banco);
    return this.http.post<Banco>(this.API_URL, banco);
  }

  update(id: number, banco: Banco): Observable<Banco> {
    console.log('✏️ Atualizando banco:', id, banco);
    return this.http.put<Banco>(`${this.API_URL}/${id}`, banco);
  }

  delete(id: number): Observable<void> {
    console.log('🗑️ Excluindo banco:', id);
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getStatusTexto(status: number): string {
    return status === 1 ? 'Ativo' : 'Inativo';
  }

  getStatusClasse(status: number): string {
    return status === 1 ? 'status-active' : 'status-inactive';
  }
}