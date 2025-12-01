import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Lancamento {
  idLancamento?: number;
  descricao: string;
  valor: number;
  parcela: number;
  dataLancamento: string;
  prazoVencimento: string;
  dataBaixa?: string;
  tipoLancamento: number;
  situacao: number;
  idPessoa: number;
  idCategoriaLancamento: number;
  idConta: number;
  descricaoCategoriaLancamento?: string;
  descricaoConta?: string;
  nome?: string;
  email?: string;
  saldo?: number;
  agencia?: string;
  numero?: string;
}

export interface LancamentoDTO {
  idLancamento?: number;
  descricao: string;
  valor: number;
  parcela: number;
  dataLancamento: string;
  prazoVencimento: string;
  dataBaixa?: string;
  tipoLancamento: number;
  situacao: number;
  idPessoa: number;
  idCategoriaLancamento: number;
  idConta: number;
  nome?: string;
  email?: string;
  descricaoCategoriaLancamento?: string;
  descricaoConta?: string;
  saldo?: number;
  agencia?: string;
  numero?: string;
}

export interface LancamentoFiltro {
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
  tipoLancamento?: number;
  situacao?: number;
  idCategoria?: number;
  idConta?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private readonly API_URL = 'http://localhost:8080/lancamento';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    
    console.log('🔐 Service - Token disponível:', !!token);
    if (token) {
      console.log('🔐 Service - Token:', token.substring(0, 20) + '...');
    }
    
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    
    console.warn('⚠️  Service - Nenhum token encontrado!');
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  findAll(): Observable<LancamentoDTO[]> {
    console.log('📋 Buscando todos os lançamentos...');
    const headers = this.getHeaders();
    console.log('🔐 Headers sendo enviados:', headers);
    
    return this.http.get<LancamentoDTO[]>(this.API_URL, { headers });
  }

  findById(id: number): Observable<LancamentoDTO> {
    console.log(`🔍 Buscando lançamento ID: ${id}`);
    return this.http.get<LancamentoDTO>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  findByFilters(filtros: LancamentoFiltro): Observable<LancamentoDTO[]> {
    console.log('🔎 Aplicando filtros:', filtros);
    
    let params = new HttpParams();
    
    if (filtros.descricao) {
      params = params.append('descricao', filtros.descricao);
    }
    if (filtros.dataInicio) {
      params = params.append('dataInicio', filtros.dataInicio);
    }
    if (filtros.dataFim) {
      params = params.append('dataFim', filtros.dataFim);
    }
    if (filtros.tipoLancamento !== undefined) {
      params = params.append('tipoLancamento', filtros.tipoLancamento.toString());
    }
    if (filtros.situacao !== undefined) {
      params = params.append('situacao', filtros.situacao.toString());
    }
    if (filtros.idCategoria) {
      params = params.append('idCategoria', filtros.idCategoria.toString());
    }
    if (filtros.idConta) {
      params = params.append('idConta', filtros.idConta.toString());
    }

    return this.http.get<LancamentoDTO[]>(`${this.API_URL}/filtros`, { 
      params, 
      headers: this.getHeaders() 
    });
  }

  create(lancamento: Lancamento): Observable<Lancamento> {
    console.log('➕ Criando novo lançamento:', lancamento);
    const headers = this.getHeaders();
    
    console.log('🔐 CREATE - Headers:', headers);
    console.log('🔐 CREATE - URL:', this.API_URL);
    
    return this.http.post<Lancamento>(this.API_URL, lancamento, { headers });
  }

  update(id: number, lancamento: Lancamento): Observable<Lancamento> {
    console.log(`✏️ Atualizando lançamento ID: ${id}`, lancamento);
    return this.http.put<Lancamento>(`${this.API_URL}/${id}`, lancamento, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    console.log(`🗑️ Deletando lançamento ID: ${id}`);
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  findByPeriodo(dataInicio: string, dataFim: string): Observable<LancamentoDTO[]> {
    console.log(`📅 Buscando lançamentos de ${dataInicio} até ${dataFim}`);
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this.http.get<LancamentoDTO[]>(`${this.API_URL}/periodo`, { 
      params, 
      headers: this.getHeaders() 
    });
  }

  getResumo(): Observable<any> {
    console.log('📊 Buscando resumo financeiro...');
    return this.http.get<any>(`${this.API_URL}/resumo`, { headers: this.getHeaders() });
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  getTipoLancamentoTexto(tipo: number): string {
    return tipo === 0 ? 'Débito' : 'Crédito';
  }

  getSituacaoTexto(situacao: number): string {
    switch (situacao) {
      case 0: return 'Pendente';
      case 1: return 'Baixado';
      case 2: return 'Atrasado';
      default: return 'Desconhecida';
    }
  }

  getSituacaoClasse(situacao: number): string {
    switch (situacao) {
      case 0: return 'badge bg-warning';
      case 1: return 'badge bg-success';
      case 2: return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getTipoLancamentoClasse(tipo: number): string {
    return tipo === 0 ? 'text-danger' : 'text-success';
  }

  getTipoLancamentoIcone(tipo: number): string {
    return tipo === 0 ? '📤' : '📥';
  }
}