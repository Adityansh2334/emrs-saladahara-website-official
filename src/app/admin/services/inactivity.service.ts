// services/inactivity.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, fromEvent, merge, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service'; // your service to clear tokens etc.

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private logoutTimer$ = new Subject<void>();
  private readonly timeoutMs = 60 * 60 * 1000; // 1 hour

  constructor(
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  startWatching(): void {
    this.ngZone.runOutsideAngular(() => {
      const activityEvents$ = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'wheel'),
        fromEvent(document, 'mousedown'),
        fromEvent(document, 'touchstart')
      );

      activityEvents$
        .pipe(
          tap(() => this.logoutTimer$.next()),
          switchMap(() => timer(this.timeoutMs))
        )
        .subscribe(() => {
          this.ngZone.run(() => {
            this.logoutUser();
          });
        });
    });
  }

  private logoutUser(): void {
    this.authService.logout(); // clear token/session
    this.router.navigate(['/admin/login']); // or your route
  }
}
