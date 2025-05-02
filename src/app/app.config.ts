import {ApplicationConfig, inject, Injector, runInInjectionContext} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppInitService } from './services/app-init.service';
import { provideZoneChangeDetection } from '@angular/core';
import { inject as angularInject } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    {
      provide: 'APP_READY',
      // Inject the Injector and pass it to runInInjectionContext
      useFactory: () => {
        const injector = angularInject(Injector); // You need to import Injector too
        return runInInjectionContext(injector, () => {
          const appInitService = inject(AppInitService);
          return appInitService.initApp();
        });
      }
    }
  ]
};
