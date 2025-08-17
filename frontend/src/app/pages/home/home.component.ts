import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { PersonalInfosService } from '../../services/personal-infos.service';
import { personalInfos } from '../../interfaces/personal-infos.model';
import { CommonModule } from '@angular/common';
import { AnimationParticuleComponent } from '../../components/animation/animation-particule/animation-particule.component';
import { PointCloudImageComponent } from '../../components/animation/point-cloud-image/point-cloud-image.component';
import { MovingBannerComponent } from '../../components/fragments/moving-banner/moving-banner.component';
import { SlidingShutterComponent } from '../../components/fragments/sliding-shutter/sliding-shutter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    // AnimationParticuleComponent,
    PointCloudImageComponent,
    MovingBannerComponent,
    SlidingShutterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  bio: string = '';
  scrollingText: string = 'FULL STACK DEVELOPER • CREATIVE DESIGNER • THINKER • PASSIONATE • RATHER GOOD LOOKING ';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private personalInfosService: PersonalInfosService
  ) {
    this.personalInfosService.get().subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          this.bio = data[0].bio;
        }
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
}