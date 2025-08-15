import {   Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  Inject,
  PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-animation-perlin',
  imports: [],
  templateUrl: './animation-perlin.component.html',
  styleUrl: './animation-perlin.component.css'
})
export class AnimatedBackgroundComponent {
  @ViewChild('grainCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId!: number;
  private isBrowser: boolean;

  // Handle framerate
  private frameCount = 0;
  private frameSkip = 1;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();

    window.addEventListener('resize', this.resizeCanvas.bind(this));
    this.drawNoise();
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      cancelAnimationFrame(this.animationFrameId);
      window.removeEventListener('resize', this.resizeCanvas.bind(this));
    }
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private drawNoise(): void {
    this.frameCount++;
    
    if (this.frameCount % this.frameSkip === 0) {
      const canvas = this.canvasRef.nativeElement;
      const imageData = this.ctx.createImageData(canvas.width, canvas.height);
      const buffer = new Uint32Array(imageData.data.buffer);

      for (let i = 0; i < buffer.length; i++) {
        const val = Math.random() * 255 | 0;
        buffer[i] = (255 << 24) | (val << 16) | (val << 8) | val;
      }

      this.ctx.putImageData(imageData, 0, 0);
    }
    
    this.animationFrameId = requestAnimationFrame(() => this.drawNoise());
  }
}
