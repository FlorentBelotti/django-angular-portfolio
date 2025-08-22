import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sliding-title',
  imports: [CommonModule],
  templateUrl: './sliding-title.component.html',
  styleUrls: ['./sliding-title.component.css']
})
export class SlidingTitleComponent {
  @Input() title: string = 'VERTICAL TITLE';
  @Input() lorem: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi vel consectetur euismod, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod.';
  @Input() fontWeight: number = 700;
  @Input() fontSize: string = '2.5em';

  isHovered = false;

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }
}
