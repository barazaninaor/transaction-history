import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // וודא שזה מיובא
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // נתיב לקובץ ה-routes שלך

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // הזרקת ה-HttpClient ישירות כאן
  ]
}).catch((err) => console.error(err));