import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sliding-title',
  imports: [CommonModule],
  templateUrl: './sliding-title.component.html',
  styleUrls: ['./sliding-title.component.css']
})
export class SlidingTitleComponent {
  @Input() title: string = 'VERTICAL TITLE';
  @Input() fontWeight: number = 700;
  @Input() fontSize: string = '1.2em'; // Uniformisé avec .lorem-title

  @Output() hoverChange = new EventEmitter<void>();

  isHovered = false;

  // Déclenche l'événement de survol pour le parent
  onMouseEnter() {
    this.isHovered = true;
    this.hoverChange.emit();
  }

  // Réinitialise l'état de survol local
  onMouseLeave() {
    this.isHovered = false;
  }
}
