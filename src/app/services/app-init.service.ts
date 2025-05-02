import { Injectable } from '@angular/core';
import { firstValueFrom, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  // Simulated init method - replace with actual logic (like API calls)
  async initApp(): Promise<void> {
    // Example: delay for 2 seconds to simulate readiness (replace with real check)
    await firstValueFrom(of(true).pipe(delay(2000)));
  }
}
