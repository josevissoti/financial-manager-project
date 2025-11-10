import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  console.log('🔐 Interceptor: Verificando token para', req.url);
  console.log('🔑 Token disponível:', !!token);
  
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('✅ Token adicionado à requisição');
    console.log('🔐 Header Authorization:', `Bearer ${token.substring(0, 20)}...`);
    return next(cloned);
  }
  
  console.log('⚠️  Requisição sem token');
  return next(req);
};