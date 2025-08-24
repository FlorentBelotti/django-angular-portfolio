import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DividedMenuItem {
  title: string;
  description: string;
  fontWeight?: number | string;
  fontSize?: string;
}

@Component({
  selector: 'app-divided-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './divided-menu.component.html',
  styleUrl: './divided-menu.component.css'
})
export class DividedMenuComponent {
  @Input() menuTitle: string = '';
  @Input() items: DividedMenuItem[] = [];
  @Input() fontFamily: string = '';
  @Input() fontSize: string = '';
  @Input() fontWeight: string | number = '';
  hoveredIndex: number|null = null;
}
