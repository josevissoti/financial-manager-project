import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('🛡️ AuthGuard verificando autenticação...');
    
    if (this.authService.isAuthenticated()) {
      console.log('✅ AuthGuard: Usuário autenticado, acesso permitido');
      
      // ✅ CORREÇÃO: Debug das informações do usuário
      const usuario = this.authService.getUsuarioLogado();
      console.log('👤 Usuário logado:', usuario);
      console.log('👑 É admin?:', this.authService.isAdmin());
      
      return true;
    } else {
      console.log('❌ AuthGuard: Usuário NÃO autenticado, redirecionando para login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}