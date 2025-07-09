import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AnimatedBackgroundComponent } from '../animated-background/animated-background.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentTitle: string = 'WELCOME';
  private routerSubscription: Subscription = new Subscription();
  constructor(private router: Router) {}

  private titleMap: { [key: string]: string } = {
    '/': 'WELCOME',
    '/resume': 'FLORENT BELOTTI',
    '/school-projects': 'MY WORKS',
    '/side-projects': 'MY PROJECTS',
    '/testimonials': 'TESTIMONIALS',
    '/contact': 'CONTACT ME',
  };

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateTitle(event.urlAfterRedirects);
      });
    this.updateTitle(this.router.url);
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private updateTitle(url: string): void {
    const titleFromUrl = url.split('?')[0].split('#')[0];
    this.currentTitle = this.titleMap[titleFromUrl] || this.titleMap['/'];
  }
}