import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-moving-banner',
  imports: [],
  templateUrl: './moving-banner.component.html',
  styleUrl: './moving-banner.component.css'
})
export class MovingBannerComponent {
  @Input() text: string = 'TEXTE DÉFILANT';
}
