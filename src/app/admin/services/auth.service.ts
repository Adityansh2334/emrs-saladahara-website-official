import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'adminToken';
  private baseUrl = '';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // For SSR
    } else {
      this.baseUrl = environment.apiUrl;
    }
    this.baseUrl += '/api/admin';
  }

  /** ✅ Login and store JWT */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
      }),
      catchError(this.handleError)
    );
  }

  /** ✅ Send OTP to official email */
  sendOtp(): Observable<OtpResponse> {
    return this.http.get<OtpResponse>(`${this.baseUrl}/send-otp`)
      .pipe(catchError(this.handleError));
  }

  /** ✅ Verify OTP */
  verifyOtp(otp: string): Observable<OtpResponse> {
    return this.http.post<OtpResponse>(`${this.baseUrl}/verify-otp`, { otp })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Update password after OTP is verified */
  updatePassword(newPassword: string): Observable<OtpResponse> {
    return this.http.post<OtpResponse>(`${this.baseUrl}/update-password`, { newPassword })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Token management */
  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(this.tokenKey) : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** 🔴 Error handler */
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMsg = `Client Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMsg = 'Backend is unreachable. Please check your connection.';
      } else if (typeof error.error === 'string') {
        errorMsg = error.error;
      } else if (error.error?.message) {
        errorMsg = error.error.message;
      } else {
        errorMsg = `Server Error: ${error.status} - ${error.statusText}`;
      }
    }

    return throwError(() => new Error(errorMsg));
  }
}
