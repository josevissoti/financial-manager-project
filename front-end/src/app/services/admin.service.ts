import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Admin {
  idAdmin?: number;
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
  isAdmin?: boolean;
}

export interface AdminDTO {
  idAdmin?: number;
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
export class AdminService {
  private readonly API_URL = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) { }

  findByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/email/${email}`).pipe(
      map(adminBackend => this.converterParaFrontend(adminBackend))
    );
  }

  findAll(): Observable<AdminDTO[]> {
    return this.http.get<AdminDTO[]>(this.API_URL);
  }

  findById(id: number): Observable<AdminDTO> {
    return this.http.get<AdminDTO>(`${this.API_URL}/${id}`);
  }

  findByCpf(cpf: string): Observable<AdminDTO> {
    return this.http.get<AdminDTO>(`${this.API_URL}/cpf/${cpf}`);
  }

  create(admin: Admin): Observable<Admin> {
    const adminParaEnviar = {
      ...admin,
      cpf: admin.cpf.replace(/\D/g, ''),
      telefone: admin.telefone.replace(/\D/g, '')
    };
    
    return this.http.post<Admin>(this.API_URL, adminParaEnviar);
  }

  update(id: number, admin: Admin): Observable<Admin> {
    const adminParaEnviar = {
      ...admin,
      cpf: admin.cpf.replace(/\D/g, ''),
      telefone: admin.telefone.replace(/\D/g, '')
    };
    
    return this.http.put<Admin>(`${this.API_URL}/${id}`, adminParaEnviar);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  promoteToAdmin(userId: number): Observable<any> {
    return this.http.put(`http://localhost:8080/admin/users/promote/${userId}`, {});
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
    if (funcoes.includes(1)) textos.push('Administrador');
    
    return textos.join(', ') || 'Nenhuma';
  }

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

  private converterParaFrontend(adminBackend: any): Admin {
    const idAdmin = adminBackend?.idAdmin || adminBackend?.idPessoa;
    
    const funcoesMapeadas = this.mapearFuncoesBackend(adminBackend?.funcaoPessoa);

    return {
      idAdmin: idAdmin,
      idUsuario: idAdmin,
      nome: adminBackend?.nome || '',
      cpf: adminBackend?.cpf || '',
      datanascimento: this.formatarData(adminBackend?.datanascimento || adminBackend?.dataNascimento),
      dataCriacao: this.formatarData(adminBackend?.dataCriacao),
      telefone: adminBackend?.telefone || '',
      email: adminBackend?.email || '',
      senha: adminBackend?.senha,
      status: adminBackend?.status || 1,
      funcaoPessoa: funcoesMapeadas,
      isAdmin: true
    };
  }

  private mapearFuncoesBackend(funcoesBackend: any): number[] {
    if (!funcoesBackend) return [0, 1];

    if (Array.isArray(funcoesBackend)) {
      return funcoesBackend.map((funcao: any) => {
        if (typeof funcao === 'string') {
          switch (funcao.toUpperCase()) {
            case 'USUARIO': return 0;
            case 'ADMIN': return 1;
            default: return 0;
          }
        } else if (typeof funcao === 'object' && funcao !== null) {
          return funcao.id || funcao.getId?.() || 0;
        } else if (typeof funcao === 'number') {
          return funcao;
        }
        return 0;
      });
    }

    if (funcoesBackend instanceof Set) {
      return this.mapearFuncoesBackend(Array.from(funcoesBackend));
    }

    return [0, 1];
  }
}