import { Component, ElementRef, Input, AfterViewInit, ViewChild, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-point-cloud-image',
  templateUrl: './point-cloud-image.component.html',
  styleUrls: ['./point-cloud-image.component.css']
})
export class PointCloudImageComponent implements AfterViewInit, OnDestroy {
  @Input() src!: string;
  @ViewChild('pointCloudCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private animationId: number = 0;
  private effect: ImagePointCloudEffect | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initPointCloudAnimation();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private initPointCloudAnimation() {
    if (!isPlatformBrowser(this.platformId) || !this.canvasRef?.nativeElement) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.warn('Cannot get 2D context from canvas');
      return;
    }
    
    const updateCanvasSize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        if (this.effect) {
          this.effect.resize(canvas.width, canvas.height);
        }
      }
    };

    updateCanvasSize();
    
    this.resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    this.resizeObserver.observe(canvas.parentElement!);
    
    this.effect = new ImagePointCloudEffect(canvas.width, canvas.height, ctx, canvas, this.src);
    
    const animate = () => {
      if (this.effect) {
        this.effect.update();
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
}

class ImageParticle {
  originX: number;
  originY: number;
  effect: ImagePointCloudEffect;
  x: number;
  y: number;
  ctx: CanvasRenderingContext2D;
  vx: number = 0;
  vy: number = 0;
  ease: number = 0.15;
  friction: number = 0.92;
  dx: number = 0;
  dy: number = 0;
  distance: number = 0;
  force: number = 0;
  angle: number = 0;
  size: number;
  color: { r: number, g: number, b: number };

  constructor(x: number, y: number, effect: ImagePointCloudEffect, color: { r: number, g: number, b: number }) {
    this.originX = x;
    this.originY = y;
    this.effect = effect;
    this.x = Math.floor(x);
    this.y = Math.floor(y);
    this.ctx = this.effect.ctx;
    this.color = color;
    this.size = Math.random() * 2 + 1;
  }

  draw() {
    this.ctx.fillStyle = `rgb(${Math.floor(this.color.r * 255)}, ${Math.floor(this.color.g * 255)}, ${Math.floor(this.color.b * 255)})`;
    this.ctx.beginPath();
    this.ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
  }

  update() {
    this.dx = this.effect.mouse.x - this.x;
    this.dy = this.effect.mouse.y - this.y;
    this.distance = this.dx * this.dx + this.dy * this.dy;
    this.force = -this.effect.mouse.radius / this.distance * 12;

    if (this.distance < this.effect.mouse.radius) {
      this.angle = Math.atan2(this.dy, this.dx);
      this.vx += this.force * Math.cos(this.angle);
      this.vy += this.force * Math.sin(this.angle);
    }

    this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
    this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
    this.draw();
  }
}

class ImagePointCloudEffect {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  particlesArray: ImageParticle[] = [];
  mouse = {
    radius: 5000,
    x: -1000,
    y: -1000
  };
  private canvas: HTMLCanvasElement;
  private imageSrc: string;
  private imageLoaded: boolean = false;

  constructor(width: number, height: number, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, imageSrc: string) {
    this.width = width;
    this.height = height;
    this.ctx = context;
    this.canvas = canvas;
    this.imageSrc = imageSrc;

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - rect.left) * window.devicePixelRatio;
      this.mouse.y = (e.clientY - rect.top) * window.devicePixelRatio;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    this.loadImage();
  }

  loadImage() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.createParticlesFromImage(img);
      this.imageLoaded = true;
    };
    img.src = this.imageSrc;
  }

  createParticlesFromImage(img: HTMLImageElement) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    
    // Scale image to cover the entire canvas (like object-fit: cover)
    const imgAspect = img.width / img.height;
    const canvasAspect = this.width / this.height;
    
    let drawWidth: number;
    let drawHeight: number;
    let offsetX = 0;
    let offsetY = 0;
    
    if (imgAspect > canvasAspect) {
      // Image is wider, fit to height and crop width
      drawHeight = this.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (this.width - drawWidth) / 2;
    } else {
      // Image is taller, fit to width and crop height
      drawWidth = this.width;
      drawHeight = drawWidth / imgAspect;
      offsetY = (this.height - drawHeight) / 2;
    }
    
    tempCanvas.width = this.width;
    tempCanvas.height = this.height;
    tempCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    
    const imageData = tempCtx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    
    this.particlesArray = [];
    const step = 4; // Adjust density
    
    for (let y = 0; y < this.height; y += step) {
      for (let x = 0; x < this.width; x += step) {
        const i = (y * this.width + x) * 4;
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;
        const a = data[i + 3] / 255;
        
        if (a > 0.1) {
          this.particlesArray.push(new ImageParticle(x, y, this, { r, g, b }));
        }
      }
    }
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    if (this.imageLoaded) {
      this.loadImage();
    }
  }

  update() {
    if (!this.imageLoaded) return;
    
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    for (let i = 0; i < this.particlesArray.length; i++) {
      this.particlesArray[i].update();
    }
  }
}