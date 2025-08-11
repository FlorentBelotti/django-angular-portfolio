import { Component, OnInit } from '@angular/core';
import { PersonalInfosService } from '../../services/personal-infos.service';
import { personalInfos } from '../../interfaces/personal-infos.model';
import { CommonModule } from '@angular/common';
import { PointCloudImageComponent } from '../../components/point-cloud-image/point-cloud-image.component';
import { AnimatedBackgroundComponent } from '../../components/animated-background/animated-background.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule
    // PointCloudImageComponent,
    // AnimatedBackgroundComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  bio: string | null = null;

  constructor(private personalInfosService: PersonalInfosService) {}

  ngOnInit(): void {
    this.personalInfosService.get().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.bio = data[0].bio;
        }
      },
      error: (error) => {
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