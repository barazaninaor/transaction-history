import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Ensure this import exists

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Ensure this is in the imports array
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { }