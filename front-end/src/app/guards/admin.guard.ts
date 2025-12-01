import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('👑 AdminGuard verificando permissões...');
    
    // DEBUG TEMPORÁRIO
    this.authService.debugAdminCheck();
    
    const isAuthenticated = this.authService.isAuthenticated();
    const isAdmin = this.authService.isAdmin();
    
    console.log('📊 Resultados:');
    console.log(' - Autenticado:', isAuthenticated);
    console.log(' - É admin:', isAdmin);
    
    if (isAuthenticated && isAdmin) {
      console.log('✅ AdminGuard: Acesso permitido');
      return true;
    } else {
      console.log('❌ AdminGuard: Acesso negado - redirecionando para dashboard');
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}