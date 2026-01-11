import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface OtpResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = '';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // For SSR
    } else {
      this.baseUrl = environment.apiUrl;
    }
    this.baseUrl += '/api/admin';
  }

  /** ✅ Login (cookie-based) */
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password }, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Logout (clears cookie) */
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Check authentication (used by AuthGuard) */
  checkAuth(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-auth`, { withCredentials: true })
      .pipe(catchError(() => new Observable<boolean>(subscriber => subscriber.next(false))));
  }

  /** ✅ Send OTP */
  sendOtp(): Observable<OtpResponse> {
    return this.http.get<OtpResponse>(`${this.baseUrl}/send-otp`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Verify OTP */
  verifyOtp(otp: string): Observable<OtpResponse> {
    return this.http.post<OtpResponse>(`${this.baseUrl}/verify-otp`, { otp }, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Update password after OTP verification */
  updatePassword(newPassword: string): Observable<OtpResponse> {
    return this.http.post<OtpResponse>(`${this.baseUrl}/update-password`, { newPassword }, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  /** 🔴 Error handler */
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Client Error: ${error.error.message}`;
    } else if (error.status === 0) {
      errorMsg = 'Backend is unreachable. Please check your connection.';
    } else if (typeof error.error === 'string') {
      errorMsg = error.error;
    } else if (error.error?.message) {
      errorMsg = error.error.message;
    } else {
      errorMsg = `Server Error: ${error.status} - ${error.statusText}`;
    }
    return throwError(() => new Error(errorMsg));
  }
}
