// auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Just pass all requests along with credentials
  const clonedReq = req.clone({
    withCredentials: true // ensures cookie is sent for all requests
  });

  return next(clonedReq);
};
