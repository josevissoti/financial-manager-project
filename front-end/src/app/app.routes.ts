import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { GerenciarUsuariosComponent } from './components/admin/gerenciar-usuarios/gerenciar-usuarios.component';
import { GerenciarBancosComponent } from './components/admin/gerenciar-bancos/gerenciar-bancos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'lancamentos',
    loadComponent: () => import('./components/lancamentos/lista-lancamentos/lista-lancamentos.component')
      .then(m => m.ListaLancamentosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'lancamentos/novo',
    loadComponent: () => import('./components/lancamentos/form-lancamento/form-lancamento.component')
      .then(m => m.FormLancamentoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'lancamentos/editar/:id',
    loadComponent: () => import('./components/lancamentos/form-lancamento/form-lancamento.component')
      .then(m => m.FormLancamentoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'contas',
    loadComponent: () => import('./components/contas/lista-contas/lista-contas.component')
      .then(m => m.ListaContasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'contas/nova',
    loadComponent: () => import('./components/contas/form-conta/form-conta.component')
      .then(m => m.FormContaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'contas/editar/:id',
    loadComponent: () => import('./components/contas/form-conta/form-conta.component')
      .then(m => m.FormContaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'categorias',
    loadComponent: () => import('./components/categorias/lista-categorias/lista-categorias.component')
      .then(m => m.ListaCategoriasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'categorias/nova',
    loadComponent: () => import('./components/categorias/form-categoria/form-categoria.component')
      .then(m => m.FormCategoriaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'categorias/editar/:id',
    loadComponent: () => import('./components/categorias/form-categoria/form-categoria.component')
      .then(m => m.FormCategoriaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./components/usuarios/lista-usuarios/lista-usuarios.component')
      .then(m => m.ListaUsuariosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios/novo',
    loadComponent: () => import('./components/usuarios/form-usuario/form-usuario.component')
      .then(m => m.FormUsuarioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios/editar/:id',
    loadComponent: () => import('./components/usuarios/form-usuario/form-usuario.component')
      .then(m => m.FormUsuarioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./components/usuarios/perfil-usuario/perfil-usuario.component')
      .then(m => m.PerfilUsuarioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/usuarios',
    component: GerenciarUsuariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/bancos',
    component: GerenciarBancosComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];