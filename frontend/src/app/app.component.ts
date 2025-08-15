import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';;

// Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AnimatedBackgroundComponent } from './components/animation/animation-perlin/animation-perlin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    HeaderComponent,
    FooterComponent,
    AdminHeaderComponent,
    AnimatedBackgroundComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  // Header management
  isAdminRoute = false;
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isAdminRoute = this.router.url.startsWith('/admin');
    });
  }
}
