import { Component, OnInit, HostListener } from '@angular/core';
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
  isAdmin: boolean = false;
  
  isUserDropdownOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private lancamentoService: LancamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🚀 Dashboard inicializando...');
    
    this.loadUserInfo();
    this.loadDashboardData();
  }

  loadUserInfo(): void {
    const usuarioLogado = this.authService.getUsuarioLogado();
    this.userEmail = usuarioLogado?.email || '';
    
    if (this.userEmail) {
      this.userName = this.userEmail.split('@')[0];
      this.userName = this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
    }

    this.isAdmin = this.authService.isAdmin();
    
    console.log('👑 Status de Admin no Dashboard:', {
      email: this.userEmail,
      isAdmin: this.isAdmin,
      funcoes: usuarioLogado?.funcaoPessoa
    });
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
    this.ultimosLancamentos = lancamentos.slice(-5).reverse();

    this.receitasMes = lancamentos
      .filter(l => l.tipoLancamento === 1)
      .reduce((sum, l) => sum + l.valor, 0);

    this.despesasMes = lancamentos
      .filter(l => l.tipoLancamento === 0)
      .reduce((sum, l) => sum + l.valor, 0);

    this.saldoTotal = this.receitasMes - this.despesasMes;

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

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  closeUserDropdown(): void {
    this.isUserDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.user-dropdown');
    
    if (dropdown && !dropdown.contains(target)) {
      this.closeUserDropdown();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

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