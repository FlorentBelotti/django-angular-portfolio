import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0].replace(/-/g, '.');
  }

  getCurrentTimestamp(): string {
    return Date.now().toString().slice(-5);
  }
}