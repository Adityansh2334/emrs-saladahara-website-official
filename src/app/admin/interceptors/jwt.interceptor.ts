// auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  // Skip adding headers for preflight OPTIONS requests
  if (req.method === 'GET' || req.method === 'OPTIONS') {
    return next(req);
  }else {
    if (token) {
      const cloned = req.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
      return next(cloned);
    }
    return next(req);
  }
};
