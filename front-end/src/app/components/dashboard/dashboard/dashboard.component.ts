import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    // Decodificar o JWT para pegar informações do usuário
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userEmail = payload.sub;
        // Se seu backend inclui o nome no token, use:
        // this.userName = payload.name || payload.sub;
        
        console.log('👤 Informações carregadas:', {
          email: this.userEmail,
          payload: payload
        });
      } catch (error) {
        console.error('❌ Erro ao decodificar token:', error);
      }
    } else {
      console.warn('⚠️ Nenhum token encontrado para carregar informações do usuário');
    }
  }

  logout(): void {
    console.log('🚪 Iniciando logout...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}