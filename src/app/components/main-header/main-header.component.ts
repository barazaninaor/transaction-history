import { Component, Input } from '@angular/core'; // 1. וודא ש-Input מיובא

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = ''; 
}