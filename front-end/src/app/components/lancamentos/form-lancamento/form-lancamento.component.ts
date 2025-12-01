import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LancamentoService, Lancamento, LancamentoDTO } from '../../../services/lancamento.service';
import { CategoriaService, Categoria } from '../../../services/categoria.service';
import { ContaService, Conta } from '../../../services/conta.service';

@Component({
  selector: 'app-form-lancamento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './form-lancamento.component.html',
  styleUrls: ['./form-lancamento.component.css']
})
export class FormLancamentoComponent implements OnInit {
  lancamento: Lancamento = {
    descricao: '',
    valor: 0,
    parcela: 1,
    dataLancamento: this.formatarDataParaInput(new Date()),
    prazoVencimento: this.formatarDataParaInput(new Date()),
    tipoLancamento: 0,
    situacao: 0,
    idPessoa: 1,
    idCategoriaLancamento: 0,
    idConta: 0,
    dataBaixa: ''
  };

  isEditando: boolean = false;
  carregando: boolean = false;
  carregandoDados: boolean = false;
  enviando: boolean = false;
  erro: string = '';
  totalParcelas: number = 1;
  showPreview: boolean = false;

  categorias: Categoria[] = [];
  contas: Conta[] = [];

  tiposLancamento = [
    { valor: 0, texto: '📤 Débito (Saída)', cor: 'debito' },
    { valor: 1, texto: '📥 Crédito (Entrada)', cor: 'credito' }
  ];

  situacoes = [
    { valor: 0, texto: '⏳ Pendente', cor: 'warning' },
    { valor: 1, texto: '✅ Baixado', cor: 'success' },
    { valor: 2, texto: '❌ Atrasado', cor: 'error' }
  ];

  constructor(
    private lancamentoService: LancamentoService,
    private categoriaService: CategoriaService,
    private contaService: ContaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.carregarDados();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditando = true;
      this.carregarLancamento(Number(id));
    }
  }

  carregarDados(): void {
    this.carregandoDados = true;
    console.log('🔄 Carregando categorias e contas do backend...');

    this.categoriaService.findAll().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        console.log('✅ Categorias carregadas:', categorias);
        
        if (!this.isEditando && categorias.length > 0 && categorias[0].idCategoriaLancamento) {
          this.lancamento.idCategoriaLancamento = categorias[0].idCategoriaLancamento;
        }
      },
      error: (error) => {
        console.error('❌ Erro ao carregar categorias:', error);
        this.erro = 'Erro ao carregar categorias.';
      }
    });

    this.contaService.findAll().subscribe({
      next: (contas) => {
        this.contas = contas;
        console.log('✅ Contas carregadas:', contas);
        
        if (!this.isEditando && contas.length > 0 && contas[0].idConta) {
          this.lancamento.idConta = contas[0].idConta;
        }
        
        this.carregandoDados = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar contas:', error);
        this.erro = 'Erro ao carregar contas.';
        this.carregandoDados = false;
      }
    });
  }

  carregarLancamento(id: number): void {
    this.carregando = true;
    this.lancamentoService.findById(id).subscribe({
      next: (lancamentoDTO: LancamentoDTO) => {
        console.log('📥 Dados recebidos do backend:', lancamentoDTO);
        
        this.lancamento = {
          idLancamento: lancamentoDTO.idLancamento || undefined,
          descricao: lancamentoDTO.descricao,
          valor: lancamentoDTO.valor,
          parcela: lancamentoDTO.parcela,
          dataLancamento: this.converterDataParaFormatoInput(lancamentoDTO.dataLancamento),
          prazoVencimento: this.converterDataParaFormatoInput(lancamentoDTO.prazoVencimento),
          dataBaixa: lancamentoDTO.dataBaixa ? this.converterDataParaFormatoInput(lancamentoDTO.dataBaixa) : '',
          tipoLancamento: lancamentoDTO.tipoLancamento,
          situacao: lancamentoDTO.situacao,
          idPessoa: lancamentoDTO.idPessoa,
          idCategoriaLancamento: lancamentoDTO.idCategoriaLancamento,
          idConta: lancamentoDTO.idConta
        };
        
        this.carregando = false;
        console.log('✅ Lançamento carregado para edição:', this.lancamento);
      },
      error: (error) => {
        this.erro = 'Erro ao carregar lançamento para edição.';
        this.carregando = false;
        console.error('❌ Erro:', error);
      }
    });
  }

  onSubmit(): void {
    this.enviando = true;
    this.erro = '';

    if (!this.lancamento.descricao || !this.lancamento.valor || this.lancamento.valor <= 0) {
      this.erro = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      this.enviando = false;
      return;
    }

    if (this.lancamento.idCategoriaLancamento === 0 || this.lancamento.idConta === 0) {
      this.erro = 'Por favor, selecione uma categoria e uma conta.';
      this.enviando = false;
      return;
    }

    if (!this.isDataValida(this.lancamento.dataLancamento)) {
      this.erro = 'Data de lançamento inválida. Use o formato DD/MM/AAAA.';
      this.enviando = false;
      return;
    }

    if (!this.isDataValida(this.lancamento.prazoVencimento)) {
      this.erro = 'Data de vencimento inválida. Use o formato DD/MM/AAAA.';
      this.enviando = false;
      return;
    }

    if (this.lancamento.dataBaixa && !this.isDataValida(this.lancamento.dataBaixa)) {
      this.erro = 'Data de baixa inválida. Use o formato DD/MM/AAAA.';
      this.enviando = false;
      return;
    }

    const lancamentoParaEnviar: Lancamento = {
      ...this.lancamento,
      dataLancamento: this.converterDataParaBackend(this.lancamento.dataLancamento),
      prazoVencimento: this.converterDataParaBackend(this.lancamento.prazoVencimento),
      dataBaixa: this.lancamento.dataBaixa ? this.converterDataParaBackend(this.lancamento.dataBaixa) : undefined
    };

    console.log('📤 Enviando lançamento:', lancamentoParaEnviar);

    if (this.isEditando && this.lancamento.idLancamento) {
      this.lancamentoService.update(this.lancamento.idLancamento, lancamentoParaEnviar).subscribe({
        next: (response) => {
          console.log('✅ Lançamento atualizado:', response);
          this.enviando = false;
          alert('Lançamento atualizado com sucesso!');
          this.router.navigate(['/lancamentos']);
        },
        error: (error) => {
          this.erro = 'Erro ao atualizar lançamento. Tente novamente.';
          this.enviando = false;
          console.error('❌ Erro:', error);
        }
      });
    } else {
      const { idLancamento, ...lancamentoParaCriar } = lancamentoParaEnviar;
      
      this.lancamentoService.create(lancamentoParaCriar).subscribe({
        next: (response) => {
          console.log('✅ Lançamento criado:', response);
          this.enviando = false;
          alert('Lançamento criado com sucesso!');
          this.router.navigate(['/lancamentos']);
        },
        error: (error) => {
          this.erro = 'Erro ao criar lançamento. Tente novamente.';
          this.enviando = false;
          console.error('❌ Erro:', error);
        }
      });
    }
  }

  definirDataAtual(campo: string): void {
    const dataAtual = this.formatarDataParaInput(new Date());
    if (campo === 'dataLancamento') {
      this.lancamento.dataLancamento = dataAtual;
    } else if (campo === 'dataBaixa') {
      this.lancamento.dataBaixa = dataAtual;
    }
  }

  calcularVencimento(dias: number): void {
    if (this.lancamento.dataLancamento && this.isDataValida(this.lancamento.dataLancamento)) {
      const data = this.converterDataStringParaDate(this.lancamento.dataLancamento);
      data.setDate(data.getDate() + dias);
      this.lancamento.prazoVencimento = this.formatarDataParaInput(data);
    }
  }

  isDataValida(dataString: string): boolean {
    if (!dataString || dataString.length !== 10) return false;
    
    const partes = dataString.split('/');
    if (partes.length !== 3) return false;
    
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);
    
    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return false;
    
    const data = new Date(ano, mes, dia);
    return data.getDate() === dia && 
           data.getMonth() === mes && 
           data.getFullYear() === ano;
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  private formatarDataParaInput(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  private converterDataParaFormatoInput(dataString: string): string {
    if (!dataString) return '';
    
    const partes = dataString.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataString;
  }

  private converterDataParaBackend(dataString: string): string {
    if (!dataString) return '';
    
    const partes = dataString.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return dataString;
  }

  private converterDataStringParaDate(dataString: string): Date {
    const partes = dataString.split('/');
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);
    return new Date(ano, mes, dia);
  }

  aplicarMascaraData(event: any, campo: string): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 2) {
      value = value;
    } else if (value.length <= 4) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    } else {
      value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
    }
    
    if (campo === 'dataLancamento') {
      this.lancamento.dataLancamento = value;
    } else if (campo === 'prazoVencimento') {
      this.lancamento.prazoVencimento = value;
    } else if (campo === 'dataBaixa') {
      this.lancamento.dataBaixa = value;
    }
  }

  validarData(campo: string): void {
    let data: string;
    
    if (campo === 'dataLancamento') {
      data = this.lancamento.dataLancamento;
    } else if (campo === 'prazoVencimento') {
      data = this.lancamento.prazoVencimento;
    } else if (campo === 'dataBaixa') {
      data = this.lancamento.dataBaixa || '';
    } else {
      return;
    }
    
    if (data && data.length === 10) {
      if (!this.isDataValida(data)) {
        this.erro = `Data ${campo} inválida. Use o formato DD/MM/AAAA.`;
      } else {
        this.erro = '';
      }
    }
  }

  voltar(): void {
    this.router.navigate(['/lancamentos']);
  }

  getTipoLancamentoTexto(valor: number): string {
    const tipo = this.tiposLancamento.find(t => t.valor === valor);
    return tipo ? tipo.texto : 'Desconhecido';
  }

  getSituacaoTexto(valor: number): string {
    const situacao = this.situacoes.find(s => s.valor === valor);
    return situacao ? situacao.texto : 'Desconhecida';
  }

  verificarBinding(): void {
    console.log('🔍 Verificando binding:', {
      tipoLancamento: this.lancamento.tipoLancamento,
      situacao: this.lancamento.situacao,
      idCategoria: this.lancamento.idCategoriaLancamento,
      idConta: this.lancamento.idConta
    });
  }
}