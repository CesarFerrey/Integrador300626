import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('accessToken'); 
  
  // SOLO excluye login/registrar
  if (req.url.includes('/login') || req.url.includes('/registrar')) {
    return next(req);
  }

  // SIEMPRE añade el token si existe
  if (token) {
    const clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(clonedReq);
  }

  return next(req);
};