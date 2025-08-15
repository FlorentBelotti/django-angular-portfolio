import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-animation-particule',
  imports: [],
  templateUrl: './animation-particule.component.html',
  styleUrl: './animation-particule.component.css'
})
export class AnimationParticuleComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private animationId: number = 0;
  private effect: Effect | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initParticleAnimation();
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

  private initParticleAnimation() {
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
    
    this.effect = new Effect(canvas.width, canvas.height, ctx, canvas);
    
    const animate = () => {
      if (this.effect) {
        this.effect.update();
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
}

class Particle {
  originX: number;
  originY: number;
  effect: Effect;
  x: number;
  y: number;
  ctx: CanvasRenderingContext2D;
  vx: number = 0;
  vy: number = 0;
  ease: number = 0.2;
  friction: number = 0.95;
  dx: number = 0;
  dy: number = 0;
  distance: number = 0;
  force: number = 0;
  angle: number = 0;
  size: number;

  constructor(x: number, y: number, effect: Effect) {
    this.originX = x;
    this.originY = y;
    this.effect = effect;
    this.x = Math.floor(x);
    this.y = Math.floor(y);
    this.ctx = this.effect.ctx;
    this.ctx.fillStyle = 'white';
    this.size = Math.floor(Math.random() * 5);
    this.draw();
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  update() {
    this.dx = this.effect.mouse.x - this.x;
    this.dy = this.effect.mouse.y - this.y;
    this.distance = this.dx * this.dx + this.dy * this.dy;
    this.force = -this.effect.mouse.radius / this.distance * 8;

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

class Effect {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  particlesArray: Particle[] = [];
  gap: number = 20;
  mouse = {
    radius: 3000,
    x: -1000,
    y: -1000
  };
  private canvas: HTMLCanvasElement;

  constructor(width: number, height: number, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.width = width;
    this.height = height;
    this.ctx = context;
    this.canvas = canvas;

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - rect.left) * window.devicePixelRatio;
      this.mouse.y = (e.clientY - rect.top) * window.devicePixelRatio;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    this.init();
  }

  init() {
    this.particlesArray = [];
    for (let x = 0; x < this.width; x += this.gap) {
      for (let y = 0; y < this.height; y += this.gap) {
        this.particlesArray.push(new Particle(x, y, this));
      }
    }
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.init();
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.particlesArray.length; i++) {
      this.particlesArray[i].update();
    }
  }
}
