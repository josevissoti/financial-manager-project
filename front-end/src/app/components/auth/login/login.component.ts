import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CredenciaisDTO } from '../../../models/auth-data.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credenciais: CredenciaisDTO = {
    username: '',
    password: ''
  };
  
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    console.log('🎯 Iniciando processo de login...');

    this.authService.login(this.credenciais).subscribe({
      next: (response) => {
        console.log('🎉 Login completo! Navegando para dashboard...');
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('💥 Erro capturado no componente:', error);
        this.error = 'Erro ao fazer login. Verifique as credenciais.';
        this.loading = false;
      },
      complete: () => {
        console.log('📞 Observable completo');
      }
    });
  }
}