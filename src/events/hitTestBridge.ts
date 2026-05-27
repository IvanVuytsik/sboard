import * as PIXI from 'pixi.js';

export function setupSkiaPointerEvents(skiaContext: any, canvasId: string, scene: PIXI.Container) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  canvas.style.pointerEvents = 'auto';
  canvas.style.cursor = 'pointer';

  canvas.addEventListener('pointerdown', (event) => {
    console.log('Skia canvas pointer down');
  });

  canvas.addEventListener('pointerup', (event) => {
    console.log('Skia canvas pointer up');
  });
}
