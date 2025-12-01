import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario, UsuarioDTO } from '../../../services/usuario.service';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.css']
})
export class FormUsuarioComponent implements OnInit {
  usuario: Usuario = {
    nome: '',
    cpf: '',
    datanascimento: this.formatarDataParaInput(new Date()),
    telefone: '',
    email: '',
    senha: '',
    status: 1,
    funcaoPessoa: [0]
  };

  confirmarSenha: string = '';
  isEditando: boolean = false;
  carregando: boolean = false;
  enviando: boolean = false;
  erro: string = '';

  statusOptions = [
    { valor: 1, texto: '✅ Ativo' },
    { valor: 0, texto: '❌ Inativo' }
  ];

  funcoesOptions = [
    { valor: 0, texto: '👤 Usuário' },
    { valor: 1, texto: '👑 Administrador' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditando = true;
      this.carregarUsuario(Number(id));
    }
  }

  carregarUsuario(id: number): void {
    this.carregando = true;
    
    this.usuarioService.findById(id).subscribe({
      next: (usuarioDTO: UsuarioDTO) => {
        this.usuario = {
          idUsuario: usuarioDTO.idUsuario,
          nome: usuarioDTO.nome,
          cpf: usuarioDTO.cpf,
          datanascimento: this.converterDataParaFormatoInput(usuarioDTO.datanascimento),
          telefone: usuarioDTO.telefone,
          email: usuarioDTO.email,
          status: usuarioDTO.status,
          funcaoPessoa: usuarioDTO.funcaoPessoa
        };
        this.carregando = false;
        console.log('✅ Usuário carregado para edição:', this.usuario);
      },
      error: (error) => {
        this.erro = 'Erro ao carregar usuário para edição.';
        this.carregando = false;
        console.error('❌ Erro:', error);
      }
    });
  }

  onSubmit(): void {
    this.enviando = true;
    this.erro = '';

    if (!this.validarFormulario()) {
      this.enviando = false;
      return;
    }

    const usuarioParaEnviar: Usuario = {
      ...this.usuario,
      datanascimento: this.converterDataParaBackend(this.usuario.datanascimento)
    };

    if (this.isEditando && (!this.usuario.senha || this.usuario.senha === '')) {
      delete usuarioParaEnviar.senha;
    }

    console.log('📤 Enviando usuário:', usuarioParaEnviar);

    if (this.isEditando && this.usuario.idUsuario) {
      this.usuarioService.update(this.usuario.idUsuario, usuarioParaEnviar).subscribe({
        next: (response) => {
          console.log('✅ Usuário atualizado:', response);
          this.enviando = false;
          alert('Usuário atualizado com sucesso!');
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          this.erro = 'Erro ao atualizar usuário. Tente novamente.';
          this.enviando = false;
          console.error('❌ Erro:', error);
        }
      });
    } else {
      this.usuarioService.create(usuarioParaEnviar).subscribe({
        next: (response) => {
          console.log('✅ Usuário criado:', response);
          this.enviando = false;
          alert('Usuário criado com sucesso!');
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          this.erro = 'Erro ao criar usuário. Tente novamente.';
          this.enviando = false;
          console.error('❌ Erro:', error);
        }
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.usuario.nome || !this.usuario.cpf || !this.usuario.email || !this.usuario.telefone) {
      this.erro = 'Por favor, preencha todos os campos obrigatórios.';
      return false;
    }

    const cpfLimpo = this.usuario.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      this.erro = 'CPF deve conter 11 dígitos.';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.email)) {
      this.erro = 'Por favor, informe um email válido.';
      return false;
    }

    if (!this.isEditando && (!this.usuario.senha || this.usuario.senha.length < 6)) {
      this.erro = 'A senha deve ter pelo menos 6 caracteres.';
      return false;
    }

    if (!this.isEditando && this.usuario.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      return false;
    }

    if (!this.validarData(this.usuario.datanascimento)) {
      this.erro = 'Data de nascimento inválida. Use o formato DD/MM/AAAA.';
      return false;
    }

    return true;
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

  validarData(dataString: string): boolean {
    if (!dataString || dataString.length !== 10) return false;
    
    const partes = dataString.split('/');
    if (partes.length !== 3) return false;
    
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);
    
    const dataObj = new Date(ano, mes, dia);
    
    return dataObj.getDate() === dia && 
           dataObj.getMonth() === mes && 
           dataObj.getFullYear() === ano;
  }

  aplicarMascaraCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 3) {
      value = value;
    } else if (value.length <= 6) {
      value = value.substring(0, 3) + '.' + value.substring(3);
    } else if (value.length <= 9) {
      value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6);
    } else {
      value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9) + '-' + value.substring(9, 11);
    }
    
    this.usuario.cpf = value;
  }

  aplicarMascaraTelefone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 2) {
      value = '(' + value;
    } else if (value.length <= 6) {
      value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
    } else if (value.length <= 10) {
      value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6);
    } else {
      value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
    }
    
    this.usuario.telefone = value;
  }

  aplicarMascaraData(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 2) {
      value = value;
    } else if (value.length <= 4) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    } else {
      value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
    }
    
    this.usuario.datanascimento = value;
  }

  toggleFuncao(funcao: number): void {
    const index = this.usuario.funcaoPessoa!.indexOf(funcao);
    if (index > -1) {
      this.usuario.funcaoPessoa!.splice(index, 1);
    } else {
      this.usuario.funcaoPessoa!.push(funcao);
    }
  }

  isFuncaoSelecionada(funcao: number): boolean {
    return this.usuario.funcaoPessoa!.includes(funcao);
  }

  voltar(): void {
    this.router.navigate(['/usuarios']);
  }

  calcularIdade(): number {
    if (!this.usuario.datanascimento || !this.validarData(this.usuario.datanascimento)) {
      return 0;
    }
    
    const partes = this.usuario.datanascimento.split('/');
    const nascimento = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || 
        (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }
}