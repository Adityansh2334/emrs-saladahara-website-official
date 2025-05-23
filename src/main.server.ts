import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import {enableProdMode} from '@angular/core';
import { environment } from './environments/environment.prod';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => bootstrapApplication(AppComponent, config).catch(err => console.error(err));

export default bootstrap;
