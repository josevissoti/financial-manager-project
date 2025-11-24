import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Admin {
  idAdmin?: number;
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

  /**
   * Buscar admin por Email
   */
  findByEmail(email: string): Observable<any> {
    console.log('🔍 Buscando admin por email:', email);
    return this.http.get<any>(`${this.API_URL}/email/${email}`);
  }

  /**
   * Buscar todos os admins
   */
  findAll(): Observable<AdminDTO[]> {
    console.log('📋 Buscando todos os admins...');
    return this.http.get<AdminDTO[]>(this.API_URL);
  }

  /**
   * Buscar admin por ID
   */
  findById(id: number): Observable<AdminDTO> {
    return this.http.get<AdminDTO>(`${this.API_URL}/${id}`);
  }

  /**
   * Buscar admin por CPF
   */
  findByCpf(cpf: string): Observable<AdminDTO> {
    return this.http.get<AdminDTO>(`${this.API_URL}/cpf/${cpf}`);
  }

  /**
   * Criar novo admin
   */
  create(admin: Admin): Observable<Admin> {
    console.log('📝 Criando novo admin:', admin);
    
    // Remove máscaras antes de enviar
    const adminParaEnviar = {
      ...admin,
      cpf: admin.cpf.replace(/\D/g, ''),
      telefone: admin.telefone.replace(/\D/g, '')
    };
    
    return this.http.post<Admin>(this.API_URL, adminParaEnviar);
  }

  /**
   * Atualizar admin existente
   */
  update(id: number, admin: Admin): Observable<Admin> {
    console.log('🔄 Atualizando admin ID:', id, admin);
    
    // Remove máscaras antes de enviar
    const adminParaEnviar = {
      ...admin,
      cpf: admin.cpf.replace(/\D/g, ''),
      telefone: admin.telefone.replace(/\D/g, '')
    };
    
    return this.http.put<Admin>(`${this.API_URL}/${id}`, adminParaEnviar);
  }

  /**
   * Deletar admin
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
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
    
    // Se já está no formato dd/MM/yyyy, retorna como está
    if (data.includes('/')) {
      return data;
    }
    
    const partes = data.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return data;
  }

  /**
   * Converter dados do backend para o formato do frontend
   */
  converterParaFrontend(adminBackend: any): Admin {
    console.log('🔄 Convertendo admin backend para frontend:', adminBackend);
    
    return {
      idAdmin: adminBackend.idAdmin || adminBackend.idPessoa,
      nome: adminBackend.nome,
      cpf: adminBackend.cpf,
      datanascimento: this.formatarData(adminBackend.datanascimento || adminBackend.dataNascimento),
      dataCriacao: this.formatarData(adminBackend.dataCriacao),
      telefone: adminBackend.telefone,
      email: adminBackend.email,
      senha: adminBackend.senha,
      status: adminBackend.status,
      // CORREÇÃO: Mapeia funções do backend para números
      funcaoPessoa: this.mapearFuncoesBackend(adminBackend.funcaoPessoa)
    };
  }

  /**
   * Mapeia funções do backend para números
   */
  private mapearFuncoesBackend(funcoesBackend: any): number[] {
    console.log('🔄 Mapeando funções do backend:', funcoesBackend);
    
    if (!funcoesBackend) return [0, 1]; // Default para admin
    
    if (Array.isArray(funcoesBackend)) {
      return funcoesBackend.map((funcao: any) => {
        // Se for string (nome da função), converte para ID
        if (typeof funcao === 'string') {
          switch (funcao.toUpperCase()) {
            case 'USUARIO': return 0;
            case 'ADMIN': return 1;
            default: return 0;
          }
        }
        // Se for objeto do enum, pega o ID
        else if (typeof funcao === 'object' && funcao !== null) {
          return funcao.id || 0;
        }
        // Já é número, retorna como está
        else if (typeof funcao === 'number') {
          return funcao;
        }
        return 0;
      });
    }
    
    return [0, 1];
  }

  /**
   * Normalizar funções para array
   */
  private normalizarFuncoes(funcoes: any): number[] {
    if (!funcoes) return [0, 1]; // Default para admin
    
    if (Array.isArray(funcoes)) {
      return funcoes;
    }
    
    if (typeof funcoes === 'number') {
      return [funcoes];
    }
    
    if (typeof funcoes === 'string') {
      return [parseInt(funcoes)];
    }
    
    // Se for Set ou outra estrutura, converte para array
    try {
      return Array.from(funcoes);
    } catch {
      return [0, 1];
    }
  }
}