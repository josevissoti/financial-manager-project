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
        
        if (!this.isEditando && bancos.length > 0 && this.conta.tipoConta !== 2) {
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
        if (conta.agencia) {
          this.conta.agencia = this.formatarAgenciaParaExibicao(conta.agencia);
        }
        if (conta.numero) {
          this.conta.numero = this.formatarNumeroParaExibicao(conta.numero);
        }
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

  onTipoContaChange(): void {
    if (this.conta.tipoConta === 2) {
      this.conta.idBanco = 0;
      this.conta.agencia = '';
      this.conta.numero = '';
    } else if (this.conta.tipoConta !== 2 && this.bancos.length > 0 && !this.conta.idBanco) {
      this.conta.idBanco = this.bancos[0].idBanco;
    }
  }

  formatarAgencia(): void {
    if (!this.conta.agencia) return;
    
    const numeros = this.conta.agencia.replace(/\D/g, '');
    
    this.conta.agencia = numeros.slice(0, 4);
  }

  formatarNumeroConta(): void {
    if (!this.conta.numero) return;
    
    const numeros = this.conta.numero.replace(/\D/g, '');
    
    if (this.conta.tipoConta === 2) {
      if (numeros.length <= 4) {
        this.conta.numero = numeros;
      } else if (numeros.length <= 8) {
        this.conta.numero = `${numeros.slice(0, 4)} ${numeros.slice(4)}`;
      } else if (numeros.length <= 12) {
        this.conta.numero = `${numeros.slice(0, 4)} ${numeros.slice(4, 8)} ${numeros.slice(8)}`;
      } else {
        this.conta.numero = `${numeros.slice(0, 4)} ${numeros.slice(4, 8)} ${numeros.slice(8, 12)} ${numeros.slice(12, 16)}`;
      }
    } 
    else {
      if (numeros.length <= 5) {
        this.conta.numero = numeros;
      } else if (numeros.length <= 6) {
        this.conta.numero = `${numeros.slice(0, 5)}-${numeros.slice(5, 6)}`;
      } else {
        this.conta.numero = `${numeros.slice(0, 5)}-${numeros.slice(5, 6)}`;
      }
    }
  }

  onSubmit(): void {
    this.enviando = true;
    this.erro = '';

    if (!this.conta.descricao) {
      this.erro = 'Por favor, preencha a descrição da conta.';
      this.enviando = false;
      return;
    }

    if (this.conta.tipoConta !== 2) {
      if (!this.conta.idBanco || this.conta.idBanco === 0) {
        this.erro = 'Por favor, selecione um banco.';
        this.enviando = false;
        return;
      }
      
      const agenciaNumeros = this.conta.agencia.replace(/\D/g, '');
      if (!agenciaNumeros || agenciaNumeros.length !== 4) {
        this.erro = 'A agência deve ter exatamente 4 dígitos.';
        this.enviando = false;
        return;
      }
      
      const numeroNumeros = this.conta.numero.replace(/\D/g, '');
      if (!numeroNumeros || numeroNumeros.length !== 6) {
        this.erro = 'O número da conta deve ter exatamente 6 dígitos (5 + dígito verificador).';
        this.enviando = false;
        return;
      }
    }

    if (this.conta.tipoConta === 2 && this.conta.saldo > 0) {
      this.conta.saldo = -this.conta.saldo;
    }

    const contaParaEnviar = {
      ...this.conta,
      agencia: this.conta.agencia.replace(/\D/g, ''),
      numero: this.conta.numero.replace(/\D/g, '')
    };

    console.log('📤 Enviando conta:', contaParaEnviar);

    if (this.isEditando && this.conta.idConta) {
      this.contaService.update(this.conta.idConta, contaParaEnviar).subscribe({
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
      this.contaService.create(contaParaEnviar).subscribe({
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
    if (tipoEncontrado) {
      return tipoEncontrado.texto.replace(/[^\w\s]/g, '').trim();
    }
    return 'Desconhecido';
  }

  getBancoNome(idBanco: number): string {
    const banco = this.bancos.find(b => b.idBanco === idBanco);
    return banco ? banco.razaoSocial : '';
  }

  getSaldoClasse(saldo: number): string {
    return saldo >= 0 ? 'positive' : 'negative';
  }

  formatarNumeroParaExibicao(numero: string): string {
    if (!numero) return '';
    
    const numeros = numero.replace(/\D/g, '');
    
    if (this.conta.tipoConta === 2) {
      if (numeros.length <= 4) return numeros;
      if (numeros.length <= 8) return `${numeros.slice(0, 4)} ${numeros.slice(4)}`;
      if (numeros.length <= 12) return `${numeros.slice(0, 4)} ${numeros.slice(4, 8)} ${numeros.slice(8)}`;
      if (numeros.length <= 16) return `${numeros.slice(0, 4)} ${numeros.slice(4, 8)} ${numeros.slice(8, 12)} ${numeros.slice(12, 16)}`;
      return `${numeros.slice(0, 4)} ${numeros.slice(4, 8)} ${numeros.slice(8, 12)} ${numeros.slice(12, 16)}`;
    }
    
    if (numeros.length <= 5) return numeros;
    if (numeros.length <= 6) return `${numeros.slice(0, 5)}-${numeros.slice(5, 6)}`;
    return `${numeros.slice(0, 5)}-${numeros.slice(5, 6)}`;
  }

  formatarAgenciaParaExibicao(agencia: string): string {
    if (!agencia) return '';
    return agencia.replace(/\D/g, '').slice(0, 4);
  }

  private mostrarSucesso(mensagem: string): void {
    console.log('✅ ' + mensagem);
  }
}