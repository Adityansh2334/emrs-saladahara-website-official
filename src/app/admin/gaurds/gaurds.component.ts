import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {AuthService} from '../services/auth.service';
import {firstValueFrom} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) {}

  async canActivate(): Promise<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof window === 'undefined') {
        // SSR: assume not logged in and prevent activation
        return false;
      }
      try {
        // ✅ Check backend if user is authenticated
        const isAuth = await firstValueFrom(this.authService.checkAuth());
        if (!isAuth) {
          this.router.navigate(['/not-authorized']);
          return false;
        }
        return true;
      } catch {
        this.router.navigate(['/not-authorized']);
        return false;
      }
    }
    return false;
  }
}
