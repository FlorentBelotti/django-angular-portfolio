import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-point-cloud-image',
  template: `<div #container class="point-cloud-canvas"></div>`,
  styleUrls: ['./point-cloud-image.component.css']
})
export class PointCloudImageComponent implements AfterViewInit {
  @Input() src!: string;
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.createPointCloud();
  }

createPointCloud() {
  let basePositions: number[] = [];
  const container = this.containerRef.nativeElement;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = this.src;
  img.onload = () => {
    const width = img.width;
    const height = img.height;
    const pointSize = 2, step = 3;

    const scene = new THREE.Scene();

    // Caméra orthographique adaptée à la taille de l'image
    const camera = new THREE.OrthographicCamera(
      -width / 2, width / 2,
      height / 2, -height / 2,
      1, 1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Dessiner l'image sur un canvas temporaire
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const contrast = 2; // Ajuste ce facteur selon le rendu souhaité

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        const r = imageData[i] / 255;
        const g = imageData[i + 1] / 255;
        const b = imageData[i + 2] / 255;
        const a = imageData[i + 3] / 255;
        if (a > 0.1) {
          // Calcul du niveau de gris avec contraste
          let gray = 0.299 * r + 0.587 * g + 0.114 * b;
          gray = Math.min(1, Math.max(0, (gray - 0.5) * contrast + 0.5));
          positions.push(x - width / 2, height / 2 - y, 0);
          colors.push(gray, gray, gray);
        }
      }
    }

    basePositions = positions.slice();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: pointSize, vertexColors: true });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    function animate() {
      requestAnimationFrame(animate);
    
      // Effet parasite TV : onde ou bruit sur l'axe Y
      const time = performance.now() * 0.001;
      const positionsAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < positionsAttr.count; i++) {
        // basePositions = [x0, y0, z0, x1, y1, z1, ...]
        const x = basePositions[i * 3];
        let y = basePositions[i * 3 + 1];
        const z = basePositions[i * 3 + 2];
      
        // Effet parasite sur une bande horizontale, ou sur tous les points
        // Ici, on applique à tous les points, mais tu peux limiter à une bande
        // Exemple : if (Math.abs(y) < 50) { ... }
        // Onde sinusoïdale + bruit aléatoire
        const parasite =
          Math.sin(time * 2 + x * 0.05) * 4 + // onde principale
          (Math.random() - 0.5) * 1.5 * (Math.sin(time * 5) > 0.98 ? 1 : 0); // glitch rare
      
        positionsAttr.setY(i, y + parasite);
      }
      positionsAttr.needsUpdate = true;
    
      renderer.render(scene, camera);
    }
    animate();
  };
}
}