import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { PersonalInfosService } from '../../services/personal-infos.service';
import { CommonModule } from '@angular/common';
import { PointCloudImageComponent } from '../../components/animation/point-cloud-image/point-cloud-image.component';
import { MovingBannerComponent } from '../../components/fragments/moving-banner/moving-banner.component';
import { SlidingShutterComponent } from '../../components/fragments/sliding-shutter/sliding-shutter.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SlidingTitleComponent } from '../../components/fragments/sliding-title/sliding-title.component';
import { AnimationParticuleComponent } from '../../components/animation/animation-particule/animation-particule.component';
import { DividedMenuComponent, DividedMenuItem } from '../../components/fragments/divided-menu/divided-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PointCloudImageComponent,
    AnimationParticuleComponent,
    MovingBannerComponent,
    SlidingShutterComponent,
    DividedMenuComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  
  // CONFIG
  
  bio = '';
  scrollingText = 'FULL STACK DEVELOPER • CREATIVE DESIGNER • DATA ENGINEER • PASSIONATE • RATHER GOOD LOOKING • FULL STACK DEVELOPER • CREATIVE DESIGNER • DATA ENGINEER • PASSIONATE • RATHER GOOD LOOKING ';

  menuTitle = 'HIGHLIGHTS';
  menuFontFamily = "'Montserrat', sans-serif";
  menuFontSize = '2em'; // augmenté
  menuFontWeight = 700; // bold
  menuItems: DividedMenuItem[] = [
    {
      title: "My projects",
      description: "Découvrez mes projets récents en développement web, design et innovation technique.",
      fontWeight: 100,
      fontSize: "1em"
    },
    {
      title: "A lot of experiences",
      description: "Plus de 3 ans d'expérience dans le développement full stack et logiciel",
      fontWeight: 100,
      fontSize: "1em"
    },
    {
      title: "Passion of christ",
      description: "Créativité, nouvelles technologies, IA, musique et photographie rythment mon quotidien professionnel.",
      fontWeight: 100,
      fontSize: "1em"
    },
    {
      title: "Again?",
      description: "Maîtrise de JavaScript, Python, Angular, Django, ainsi que des outils modernes de développement et de design.",
      fontWeight: 100,
      fontSize: "1em"
    },
    {
      title: "Howdy! Traveller",
      description: "Diplômé d'une grande école d'ingénieur, passionné par l'apprentissage continu et la veille technologique.",
      fontWeight: 100,
      fontSize: "1em"
    }
  ];

  // INIT

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private personalInfosService: PersonalInfosService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {
    this.loadBio();
    this.registerIcons();
  }

  // METHODS

  private loadBio() {
    this.personalInfosService.get().subscribe({
      next: (data: any) => {
        if (data?.length > 0) this.bio = data[0].bio;
      },
      error: (error: any) => {
        console.error('Error loading bio', error);
      }
    });
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0].replace(/-/g, '.');
  }

  getCurrentTimestamp(): string {
    return Date.now().toString().slice(-5);
  }

  goToSchoolProjects() {
    this.router.navigate(['/works']);
  }

  // DISPLAY

  private registerIcons() {
    this.matIconRegistry.addSvgIconLiteral(
      'github',
      this.domSanitizer.bypassSecurityTrustHtml(`
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/>
        </svg>
      `)
    );
    this.matIconRegistry.addSvgIconLiteral(
      'linkedin',
      this.domSanitizer.bypassSecurityTrustHtml(`
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z"/>
        </svg>
      `)
    );
  }
}