import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router'; // הוסף את withHashLocation לכאן
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()), // הוסף את הקריאה לפונקציה כאן
    provideHttpClient()
  ]
};