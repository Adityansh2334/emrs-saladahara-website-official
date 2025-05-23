import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {AuthService} from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof window === 'undefined') {
        // SSR: assume not logged in and prevent activation
        return false;
      }
      const isLoggedIn = this.authService.isLoggedIn();
      if (!isLoggedIn) {
        this.router.navigate(['/not-authorized']);
        return false;
      }
      return true;
    }
    return false;
  }
}
