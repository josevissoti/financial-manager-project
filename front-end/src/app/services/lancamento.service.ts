import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Interface para o Lançamento (baseado no seu backend)
export interface Lancamento {
  idLancamento?: number;
  descricao: string;
  valor: number;
  parcela: number;
  dataLancamento: string;
  prazoVencimento: string;
  dataBaixa?: string;
  tipoLancamento: number; // 0=Débito, 1=Crédito
  situacao: number; // 0=Pendente, 1=Baixado, 2=Atrasado
  idPessoa: number;
  idCategoriaLancamento: number;
  idConta: number;
}

// Interface para a resposta da API
export interface LancamentoDTO {
  idLancamento: number;
  descricao: string;
  valor: number;
  parcela: number;
  dataLancamento: string;
  prazoVencimento: string;
  dataBaixa: string | null;
  tipoLancamento: number;
  situacao: number;
  idPessoa: number;
  nome: string;
  email: string;
  idCategoriaLancamento: number;
  descricaoCategoriaLancamento: string;
  idConta: number;
  descricaoConta: string;
  saldo: number;
  agencia: string;
  numero: string;
}

// Interface para filtros
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

  /**
   * Buscar todos os lançamentos
   */
  findAll(): Observable<LancamentoDTO[]> {
    console.log('📋 Buscando todos os lançamentos...');
    return this.http.get<LancamentoDTO[]>(this.API_URL);
  }

  /**
   * Buscar lançamento por ID
   */
  findById(id: number): Observable<LancamentoDTO> {
    console.log(`🔍 Buscando lançamento ID: ${id}`);
    return this.http.get<LancamentoDTO>(`${this.API_URL}/${id}`);
  }

  /**
   * Buscar lançamentos com filtros
   */
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

    return this.http.get<LancamentoDTO[]>(`${this.API_URL}/filtros`, { params });
  }

  /**
   * Criar novo lançamento
   */
  create(lancamento: Lancamento): Observable<Lancamento> {
    console.log('➕ Criando novo lançamento:', lancamento);
    return this.http.post<Lancamento>(this.API_URL, lancamento);
  }

  /**
   * Atualizar lançamento existente
   */
  update(id: number, lancamento: Lancamento): Observable<Lancamento> {
    console.log(`✏️ Atualizando lançamento ID: ${id}`, lancamento);
    return this.http.put<Lancamento>(`${this.API_URL}/${id}`, lancamento);
  }

  /**
   * Deletar lançamento
   */
  delete(id: number): Observable<void> {
    console.log(`🗑️ Deletando lançamento ID: ${id}`);
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Buscar lançamentos por período
   */
  findByPeriodo(dataInicio: string, dataFim: string): Observable<LancamentoDTO[]> {
    console.log(`📅 Buscando lançamentos de ${dataInicio} até ${dataFim}`);
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this.http.get<LancamentoDTO[]>(`${this.API_URL}/periodo`, { params });
  }

  /**
   * Buscar resumo financeiro (para o dashboard)
   */
  getResumo(): Observable<any> {
    console.log('📊 Buscando resumo financeiro...');
    return this.http.get<any>(`${this.API_URL}/resumo`);
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

  /**
   * Utilitário: Obter texto do tipo de lançamento
   */
  getTipoLancamentoTexto(tipo: number): string {
    return tipo === 0 ? 'Débito' : 'Crédito';
  }

  /**
   * Utilitário: Obter texto da situação
   */
  getSituacaoTexto(situacao: number): string {
    switch (situacao) {
      case 0: return 'Pendente';
      case 1: return 'Baixado';
      case 2: return 'Atrasado';
      default: return 'Desconhecida';
    }
  }

  /**
   * Utilitário: Obter classe CSS para situação
   */
  getSituacaoClasse(situacao: number): string {
    switch (situacao) {
      case 0: return 'badge bg-warning'; // Pendente
      case 1: return 'badge bg-success'; // Baixado
      case 2: return 'badge bg-danger';  // Atrasado
      default: return 'badge bg-secondary';
    }
  }

  /**
   * Utilitário: Obter classe CSS para tipo
   */
  getTipoLancamentoClasse(tipo: number): string {
    return tipo === 0 ? 'text-danger' : 'text-success';
  }

  /**
   * Utilitário: Obter ícone para tipo
   */
  getTipoLancamentoIcone(tipo: number): string {
    return tipo === 0 ? '📤' : '📥';
  }
}