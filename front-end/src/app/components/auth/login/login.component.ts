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
      this.error = 'Credenciais inválidas. Tente novamente.';
      this.loading = false;
    }
  });
}
}