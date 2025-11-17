import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContaService, Conta } from '../../../services/conta.service';
import { BancoService, Banco } from '../../../services/banco.service';

@Component({
  selector: 'app-form-conta',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './form-conta.component.html',
  styleUrls: ['./form-conta.component.css']
})
export class FormContaComponent implements OnInit {
  conta: Conta = {
    descricao: '',
    saldo: 0,
    limite: 0,
    agencia: '',
    numero: '',
    tipoConta: 0,
    idPessoa: 1,
    idBanco: 0
  };

  isEditando: boolean = false;
  carregando: boolean = false;
  carregandoDados: boolean = false;
  enviando: boolean = false;
  erro: string = '';

  bancos: Banco[] = [];

  tiposConta = [
    { valor: 0, texto: '💳 Conta Corrente' },
    { valor: 1, texto: '📈 Conta Investimento' },
    { valor: 2, texto: '💳 Cartão de Crédito' },
    { valor: 3, texto: '🍎 Alimentação' },
    { valor: 4, texto: '💰 Poupança' }
  ];

  constructor(
    private contaService: ContaService,
    private bancoService: BancoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.carregarBancos();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditando = true;
      this.carregarConta(Number(id));
    }
  }

  carregarBancos(): void {
    this.carregandoDados = true;
    
    this.bancoService.findAll().subscribe({
      next: (bancos) => {
        this.bancos = bancos;
        console.log('✅ Bancos carregados:', bancos);
        
        if (!this.isEditando && bancos.length > 0) {
          this.conta.idBanco = bancos[0].idBanco;
        }
        
        this.carregandoDados = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar bancos:', error);
        this.erro = 'Erro ao carregar bancos.';
        this.carregandoDados = false;
      }
    });
  }

  carregarConta(id: number): void {
    this.carregando = true;
    
    this.contaService.findById(id).subscribe({
      next: (conta) => {
        this.conta = conta;
        this.carregando = false;
        console.log('✅ Conta carregada para edição:', conta);
      },
      error: (error) => {
        this.erro = 'Erro ao carregar conta para edição.';
        this.carregando = false;
        console.error('❌ Erro:', error);
      }
    });
  }

  onSubmit(): void {
    this.enviando = true;
    this.erro = '';

    // Validações
    if (!this.conta.descricao || !this.conta.agencia || !this.conta.numero) {
      this.erro = 'Por favor, preencha todos os campos obrigatórios.';
      this.enviando = false;
      return;
    }

    if (this.conta.idBanco === 0) {
      this.erro = 'Por favor, selecione um banco.';
      this.enviando = false;
      return;
    }

    console.log('📤 Enviando conta:', this.conta);

    if (this.isEditando && this.conta.idConta) {
      this.contaService.update(this.conta.idConta, this.conta).subscribe({
        next: (response) => {
          console.log('✅ Conta atualizada:', response);
          this.enviando = false;
          this.mostrarSucesso('Conta atualizada com sucesso!');
          this.router.navigate(['/contas']);
        },
        error: (error) => {
          this.erro = 'Erro ao atualizar conta. Tente novamente.';
          this.enviando = false;
          console.error('❌ Erro:', error);
        }
      });
    } else {
      this.contaService.create(this.conta).subscribe({
        next: (response) => {
          console.log('✅ Conta criada:', response);
          this.enviando = false;
          this.mostrarSucesso('Conta criada com sucesso!');
          this.router.navigate(['/contas']);
        },
        error: (error) => {
          this.erro = 'Erro ao criar conta. Tente novamente.';
          this.enviando = false;
          console.error('❌ Erro:', error);
        }
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/contas']);
  }

  formatarValor(valor: number): string {
    return this.contaService.formatarValor(valor);
  }

  getTipoContaTexto(tipo: number): string {
    const tipoEncontrado = this.tiposConta.find(t => t.valor === tipo);
    return tipoEncontrado ? tipoEncontrado.texto.replace(/[^\w\s]/g, '') : 'Desconhecido';
  }

  getBancoNome(idBanco: number): string {
    const banco = this.bancos.find(b => b.idBanco === idBanco);
    return banco ? banco.razaoSocial : '';
  }

  getSaldoClasse(saldo: number): string {
    return saldo >= 0 ? 'positive' : 'negative';
  }

  getLimiteStatusClasse(): string {
    if (this.conta.limite <= 0) return 'status-info';
    
    const utilizacao = (this.conta.saldo / this.conta.limite) * 100;
    
    if (this.conta.tipoConta === 2) {
      // Cartão de crédito - saldo negativo é uso do limite
      if (this.conta.saldo < 0 && Math.abs(this.conta.saldo) >= this.conta.limite * 0.9) {
        return 'status-danger';
      }
      if (this.conta.saldo < 0 && Math.abs(this.conta.saldo) >= this.conta.limite * 0.7) {
        return 'status-warning';
      }
      return 'status-success';
    }
    
    // Outras contas - saldo positivo é bom
    if (this.conta.saldo >= this.conta.limite * 0.7) {
      return 'status-success';
    }
    if (this.conta.saldo >= this.conta.limite * 0.4) {
      return 'status-info';
    }
    return 'status-secondary';
  }

  getLimiteStatusTexto(): string {
    if (this.conta.limite <= 0) return 'Sem limite definido';
    
    const utilizacao = (this.conta.saldo / this.conta.limite) * 100;
    
    if (this.conta.tipoConta === 2) {
      // Cartão de crédito
      if (this.conta.saldo < 0 && Math.abs(this.conta.saldo) >= this.conta.limite * 0.9) {
        return '⚠️ Limite quase esgotado';
      }
      if (this.conta.saldo < 0 && Math.abs(this.conta.saldo) >= this.conta.limite * 0.7) {
        return '🔶 Uso elevado do limite';
      }
      if (this.conta.saldo < 0) {
        return '✅ Limite sob controle';
      }
      return '🟢 Sem utilização do limite';
    }
    
    // Outras contas
    if (this.conta.saldo >= this.conta.limite * 0.7) {
      return '🎉 Meta quase atingida!';
    }
    if (this.conta.saldo >= this.conta.limite * 0.4) {
      return '📈 Boa evolução';
    }
    return '🌱 Começando bem';
  }

  private mostrarSucesso(mensagem: string): void {
    // Poderia ser um toast notification
    console.log('✅ ' + mensagem);
  }
}