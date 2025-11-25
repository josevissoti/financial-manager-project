import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LancamentoService, LancamentoDTO } from '../../../services/lancamento.service';
import { AdminService } from '../../../services/admin.service';
import { UsuarioService } from '../../../services/usuario.service';

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
  
  // Controle do dropdown do usuário
  isUserDropdownOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private lancamentoService: LancamentoService,
    private adminService: AdminService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadDashboardData();
  }

  loadUserInfo(): void {
    const usuarioLogado = this.authService.getUsuarioLogado();
    this.userEmail = usuarioLogado?.email || '';
    
    if (this.userEmail) {
      // Tentar extrair o nome do email (parte antes do @)
      this.userName = this.userEmail.split('@')[0];
      this.userName = this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
    }

    // ✅ VERIFICAR SE É ADMIN USANDO A MESMA ESTRATÉGIA DO PERFIL
    this.checkAdminStatus();
  }

  private checkAdminStatus(): void {
    const usuarioLogado = this.authService.getUsuarioLogado();
    const email = usuarioLogado?.email;

    if (!email) {
      console.log('❌ Email não disponível para verificar admin');
      this.isAdmin = false;
      return;
    }

    console.log('🔍 Verificando se é Admin para:', email);

    // Estratégia: Tenta como ADMIN primeiro, depois USUÁRIO (igual ao perfil)
    this.adminService.findByEmail(email).subscribe({
      next: (adminCompleto: any) => {
        console.log('✅ É Admin! Dados:', adminCompleto);
        this.isAdmin = true;
        
        // Atualiza os dados do usuário no AuthService (igual ao perfil)
        this.authService.atualizarUsuario({
          ...usuarioLogado,
          tipo: 'ADMIN',
          isAdmin: true,
          funcaoPessoa: this.mapearFuncoesDoBackend(adminCompleto.funcaoPessoa),
          idAdmin: adminCompleto.idAdmin || adminCompleto.idPessoa
        });
      },
      error: (errorAdmin) => {
        console.log('❌ Não é admin, verificando como usuário normal...');
        
        // Se não for admin, tenta como usuário
        this.usuarioService.findByEmail(email).subscribe({
          next: (usuarioCompleto: any) => {
            console.log('✅ É Usuário normal:', usuarioCompleto);
            this.isAdmin = false;
            
            // Atualiza os dados do usuário no AuthService
            this.authService.atualizarUsuario({
              ...usuarioLogado,
              tipo: 'USER', 
              isAdmin: false,
              funcaoPessoa: this.mapearFuncoesDoBackend(usuarioCompleto.funcaoPessoa),
              idUsuario: usuarioCompleto.idUsuario || usuarioCompleto.idPessoa
            });
          },
          error: (errorUsuario) => {
            console.log('❌ Não encontrado nem como admin nem como usuário');
            this.isAdmin = false;
            
            // Fallback: verifica dados básicos do AuthService
            const temTipoAdmin = usuarioLogado?.tipo === 'ADMIN';
            const temIsAdmin = usuarioLogado?.isAdmin === true;
            const temFuncaoAdmin = usuarioLogado?.funcaoPessoa && 
                                  Array.isArray(usuarioLogado.funcaoPessoa) && 
                                  usuarioLogado.funcaoPessoa.includes(1);

            this.isAdmin = temTipoAdmin || temIsAdmin || temFuncaoAdmin;
            
            console.log('🎯 Status final de Admin (fallback):', this.isAdmin);
          }
        });
      }
    });
  }

  // Método auxiliar igual ao do perfil para mapear funções
  private mapearFuncoesDoBackend(funcoesBackend: any): number[] {
    if (!funcoesBackend) return [0];

    if (Array.isArray(funcoesBackend) && funcoesBackend.every(item => typeof item === 'number')) {
      return funcoesBackend;
    }

    if (Array.isArray(funcoesBackend)) {
      return funcoesBackend.map(item => {
        if (typeof item === 'number') return item;
        if (typeof item === 'string') {
          return item.toUpperCase() === 'ADMIN' ? 1 : 0;
        }
        if (typeof item === 'object' && item !== null) {
          return item.id || 0;
        }
        return 0;
      });
    }

    if (funcoesBackend instanceof Set) {
      return this.mapearFuncoesDoBackend(Array.from(funcoesBackend));
    }

    return [0];
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

  // Métodos para controle do dropdown
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