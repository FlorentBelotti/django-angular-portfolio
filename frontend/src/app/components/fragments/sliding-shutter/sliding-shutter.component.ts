import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sliding-shutter',
  imports: [],
  templateUrl: './sliding-shutter.component.html',
  styleUrl: './sliding-shutter.component.css'
})
export class SlidingShutterComponent {
  @Input() text: string = '';
  isPaused = false;

  pauseAnimation() {
    this.isPaused = true;
  }
  resumeAnimation() {
    this.isPaused = false;
  }
}
