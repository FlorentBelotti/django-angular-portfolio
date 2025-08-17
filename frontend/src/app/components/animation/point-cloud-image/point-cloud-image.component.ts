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
  // Configuration variables
  private static readonly EASE = 0.15;
  private static readonly FRICTION = 0.92;
  private static readonly FORCE_MULTIPLIER = 12;
  private static readonly PARTICLE_SIZE = 2;

  // Properties
  originX: number;
  originY: number;
  effect: ImagePointCloudEffect;
  x: number;
  y: number;
  ctx: CanvasRenderingContext2D;
  vx: number = 0;
  vy: number = 0;
  dx: number = 0;
  dy: number = 0;
  distance: number = 0;
  force: number = 0;
  angle: number = 0;
  size: number;
  color: { r: number, g: number, b: number };
  private colorString: string; // Cached color string

  constructor(x: number, y: number, effect: ImagePointCloudEffect, color: { r: number, g: number, b: number }) {
    this.originX = x;
    this.originY = y;
    this.effect = effect;
    this.x = x;
    this.y = y;
    this.ctx = this.effect.ctx;
    this.color = color;
    this.size = ImageParticle.PARTICLE_SIZE;
    // Pre-calculate color string for performance
    this.colorString = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;
  }

  draw() {
    this.ctx.fillStyle = this.colorString;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  update() {
    // Optimized distance calculation
    this.dx = this.effect.mouse.x - this.x;
    this.dy = this.effect.mouse.y - this.y;
    this.distance = this.dx * this.dx + this.dy * this.dy;

    if (this.distance < this.effect.mouse.radius) {
      this.force = -this.effect.mouse.radius / this.distance * ImageParticle.FORCE_MULTIPLIER;
      this.angle = Math.atan2(this.dy, this.dx);
      this.vx += this.force * Math.cos(this.angle);
      this.vy += this.force * Math.sin(this.angle);
    }

    // Apply friction and ease back to origin
    this.vx *= ImageParticle.FRICTION;
    this.vy *= ImageParticle.FRICTION;
    this.x += this.vx + (this.originX - this.x) * ImageParticle.EASE;
    this.y += this.vy + (this.originY - this.y) * ImageParticle.EASE;
    
    this.draw();
  }
}

class ImagePointCloudEffect {
  // Configuration variables - Easy to adjust
  private static readonly PARTICLE_STEP = 3;
  private static readonly ALPHA_THRESHOLD = 0.05;
  private static readonly MOUSE_RADIUS = 5000;
  private static readonly BACKGROUND_ALPHA = 0.05;
  private static readonly ANIMATION_DELAY = 100;

  // Properties
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  particlesArray: ImageParticle[] = [];
  mouse = {
    radius: ImagePointCloudEffect.MOUSE_RADIUS,
    x: -1000,
    y: -1000
  };
  private canvas: HTMLCanvasElement;
  private imageSrc: string;
  private imageLoaded: boolean = false;
  private lastTime: number = 0;
  private frameSkip: number = 0;
  private readonly targetFPS = 60;
  private readonly frameInterval = 1000 / this.targetFPS;

  constructor(width: number, height: number, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, imageSrc: string) {
    this.width = width;
    this.height = height;
    this.ctx = context;
    this.canvas = canvas;
    this.imageSrc = imageSrc;

    // Optimized event listeners with passive option
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this), { passive: true });

    this.loadImage();
  }

  private handleMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) * window.devicePixelRatio;
    this.mouse.y = (e.clientY - rect.top) * window.devicePixelRatio;
  }

  private handleMouseLeave() {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
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
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })!;
    
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
    
    // Clear previous particles
    this.particlesArray.length = 0;
    
    // Optimized particle creation with batch processing
    const step = ImagePointCloudEffect.PARTICLE_STEP;
    const threshold = ImagePointCloudEffect.ALPHA_THRESHOLD;
    
    for (let y = step * 0.5; y < this.height; y += step) {
      for (let x = step * 0.5; x < this.width; x += step) {
        const i = (Math.floor(y) * this.width + Math.floor(x)) * 4;
        const a = data[i + 3] / 255;
        
        if (a > threshold) {
          const r = data[i] / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;
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

  update(currentTime: number = performance.now()) {
    if (!this.imageLoaded) return;
    
    // Frame rate limiting for performance
    if (currentTime - this.lastTime < this.frameInterval) {
      return;
    }
    this.lastTime = currentTime;
    
    // Optimized background clear
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = `rgba(0, 0, 0, ${ImagePointCloudEffect.BACKGROUND_ALPHA})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Batch particle updates
    const particles = this.particlesArray;
    const length = particles.length;
    
    for (let i = 0; i < length; i++) {
      particles[i].update();
    }
  }
}