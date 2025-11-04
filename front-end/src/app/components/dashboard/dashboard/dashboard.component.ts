import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LancamentoService, LancamentoDTO } from '../../../services/lancamento.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string = 'Usuário';
  userEmail: string = '';
  totalLancamentos: number = 0;
  saldoTotal: number = 0;
  receitasMes: number = 0;
  despesasMes: number = 0;
  lancamentosPendentes: number = 0;
  ultimosLancamentos: LancamentoDTO[] = [];
  carregando: boolean = true;

  constructor(
    private authService: AuthService,
    private lancamentoService: LancamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadDashboardData();
  }

  loadUserInfo(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userEmail = payload.sub;
        // Tentar extrair o nome do email (parte antes do @)
        this.userName = this.userEmail.split('@')[0];
        this.userName = this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
      } catch (error) {
        console.error('❌ Erro ao decodificar token:', error);
      }
    }
  }

  loadDashboardData(): void {
    this.carregando = true;
    console.log('📊 Carregando dados do dashboard...');

    this.lancamentoService.findAll().subscribe({
      next: (lancamentos) => {
        console.log('✅ Dados carregados:', lancamentos.length, 'lançamentos');
        this.processarDados(lancamentos);
        this.carregando = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar lançamentos:', error);
        this.carregando = false;
        // Em caso de erro, definir valores padrão
        this.totalLancamentos = 0;
        this.saldoTotal = 0;
        this.receitasMes = 0;
        this.despesasMes = 0;
        this.lancamentosPendentes = 0;
      }
    });
  }

  private processarDados(lancamentos: LancamentoDTO[]): void {
    this.totalLancamentos = lancamentos.length;
    this.ultimosLancamentos = lancamentos.slice(-5).reverse(); // Últimos 5, mais recentes primeiro

    // Calcular totais
    this.receitasMes = lancamentos
      .filter(l => l.tipoLancamento === 1) // Crédito
      .reduce((sum, l) => sum + l.valor, 0);

    this.despesasMes = lancamentos
      .filter(l => l.tipoLancamento === 0) // Débito
      .reduce((sum, l) => sum + l.valor, 0);

    this.saldoTotal = this.receitasMes - this.despesasMes;

    // Contar lançamentos pendentes (situação = 0)
    this.lancamentosPendentes = lancamentos
      .filter(l => l.situacao === 0)
      .length;

    console.log('💰 Resumo calculado:', {
      saldoTotal: this.saldoTotal,
      receitas: this.receitasMes,
      despesas: this.despesasMes,
      totalLancamentos: this.totalLancamentos,
      pendentes: this.lancamentosPendentes
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Métodos auxiliares para o template
  formatarValor(valor: number): string {
    return this.lancamentoService.formatarValor(valor);
  }

  getSituacaoClasse(situacao: number): string {
    return this.lancamentoService.getSituacaoClasse(situacao);
  }

  getSituacaoTexto(situacao: number): string {
    return this.lancamentoService.getSituacaoTexto(situacao);
  }

  getTipoLancamentoIcone(tipo: number): string {
    return this.lancamentoService.getTipoLancamentoIcone(tipo);
  }

  getTipoLancamentoClasse(tipo: number): string {
    return this.lancamentoService.getTipoLancamentoClasse(tipo);
  }

  getTipoLancamentoTexto(tipo: number): string {
    return this.lancamentoService.getTipoLancamentoTexto(tipo);
  }
}