import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService, Usuario } from '../../../services/usuario.service';
import { CredenciaisDTO } from '../../../models/auth-data.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoginMode = true;
  
  credenciais: CredenciaisDTO = {
    username: '',
    password: ''
  };
  
  novoUsuario: Usuario = {
    nome: '',
    cpf: '',
    datanascimento: '',
    telefone: '',
    email: '',
    senha: '',
    status: 1,
    funcaoPessoa: [0]
  };
  
  confirmarSenha = '';
  
  loading = false;
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.success = '';
    this.credenciais = { username: '', password: '' };
    this.novoUsuario = {
      nome: '',
      cpf: '',
      datanascimento: '',
      telefone: '',
      email: '',
      senha: '',
      status: 1,
      funcaoPessoa: [0]
    };
    this.confirmarSenha = '';
  }

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    console.log('🚀 Iniciando processo de login...');
    
    this.authService.login(this.credenciais).subscribe({
      next: (response) => {
        console.log('🎉 Login realizado com sucesso!');
        console.log('🔄 Redirecionando para dashboard...');
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('💥 Erro no login:', error);
        this.error = 'Credenciais inválidas. Verifique seu email e senha.';
        this.loading = false;
      }
    });
  }

  onRegister(): void {
    if (this.loading) return;
    
    if (this.novoUsuario.senha !== this.confirmarSenha) {
      this.error = 'As senhas não coincidem.';
      return;
    }
    
    if (this.novoUsuario.senha && this.novoUsuario.senha.length < 6) {
      this.error = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    if (!this.validarCPF(this.novoUsuario.cpf)) {
      this.error = 'CPF inválido.';
      return;
    }

    if (!this.validarDataNascimento(this.novoUsuario.datanascimento)) {
      this.error = 'Data de nascimento inválida ou usuário menor de 16 anos.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';
    
    console.log('🚀 Iniciando processo de cadastro...');
    
    const usuarioParaEnviar = {
      ...this.novoUsuario,
      cpf: this.novoUsuario.cpf.replace(/\D/g, ''),
      telefone: this.novoUsuario.telefone.replace(/\D/g, ''),
      datanascimento: this.converterDataParaBackend(this.novoUsuario.datanascimento)
    };
    
    this.usuarioService.create(usuarioParaEnviar).subscribe({
      next: (response) => {
        console.log('🎉 Cadastro realizado com sucesso!');
        this.loading = false;
        this.success = 'Cadastro realizado com sucesso! Faça login para continuar.';
        
        setTimeout(() => {
          this.isLoginMode = true;
          this.credenciais.username = this.novoUsuario.email;
          this.credenciais.password = '';
        }, 2000);
      },
      error: (error) => {
        console.error('💥 Erro no cadastro:', error);
        this.error = this.getErrorMessage(error);
        this.loading = false;
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    
    if (error.status === 400) {
      return 'Dados inválidos. Verifique as informações preenchidas.';
    }
    
    if (error.status === 409) {
      return 'Email ou CPF já cadastrado no sistema.';
    }
    
    return 'Erro ao realizar cadastro. Tente novamente.';
  }

  formatarCPF(event: any): void {
    let cpf = event.target.value.replace(/\D/g, '');
    
    if (cpf.length > 11) {
      cpf = cpf.substring(0, 11);
    }
    
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    this.novoUsuario.cpf = cpf;
  }

  formatarTelefone(event: any): void {
    let telefone = event.target.value.replace(/\D/g, '');
    
    if (telefone.length > 11) {
      telefone = telefone.substring(0, 11);
    }
    
    if (telefone.length === 11) {
      telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
      telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
    } else if (telefone.length === 10) {
      telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
      telefone = telefone.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    this.novoUsuario.telefone = telefone;
  }

  formatarDataNascimento(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    
    if (valor.length > 8) {
      valor = valor.substring(0, 8);
    }
    
    let dataFormatada = '';
    
    if (valor.length > 0) {
      dataFormatada += valor.substring(0, 2);
    }
    
    if (valor.length > 2) {
      dataFormatada += '/' + valor.substring(2, 4);
    }
    
    if (valor.length > 4) {
      dataFormatada += '/' + valor.substring(4, 8);
    }
    
    this.novoUsuario.datanascimento = dataFormatada;
  }

  private validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }

  private validarDataNascimento(data: string): boolean {
    if (!data) return false;
    
    const dataLimpa = data.replace(/\D/g, '');
    
    if (dataLimpa.length !== 8) return false;
    
    const dia = parseInt(dataLimpa.substring(0, 2));
    const mes = parseInt(dataLimpa.substring(2, 4));
    const ano = parseInt(dataLimpa.substring(4, 8));
    
    if (mes < 1 || mes > 12) return false;
    if (dia < 1 || dia > 31) return false;
    
    if ([4, 6, 9, 11].includes(mes) && dia > 30) return false;
    
    if (mes === 2) {
      const isBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
      if (dia > (isBissexto ? 29 : 28)) return false;
    }
    
    const dataNasc = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    
    const idadeReal = (mesAtual < (mes - 1) || (mesAtual === (mes - 1) && diaAtual < dia)) 
      ? idade - 1 
      : idade;
    
    return idadeReal >= 16;
  }

  private converterDataParaBackend(data: string): string {
    if (!data) return '';
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    }
    
    const partes = data.split('/');
    if (partes.length === 3) {
      const [dia, mes, ano] = partes;
      const diaFormatado = dia.padStart(2, '0');
      const mesFormatado = mes.padStart(2, '0');
      return `${ano}-${mesFormatado}-${diaFormatado}`;
    }
    
    return data;
  }

  onDataKeyDown(event: KeyboardEvent): void {
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return;
    }
    
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
}