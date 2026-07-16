import { Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router'; // הוסף את withHashLocation

export const routes: Routes = [
  { path: 'transactions', component: TransactionsComponent },
  { path: '', redirectTo: '/transactions', pathMatch: 'full' } // Redirect to transactions by default
];



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()) // כאן הוספנו את ה-Hash
  ]
};