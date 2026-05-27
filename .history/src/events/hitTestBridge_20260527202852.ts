import * as PIXI from 'pixi.js';

export function setupSkiaPointerEvents(_skiaContext: any, canvasId: string, _scene: PIXI.Container) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  canvas.style.pointerEvents = 'auto';
  canvas.style.cursor = 'pointer';

  canvas.addEventListener('pointerdown', (_event) => {
    console.log('Skia canvas pointer down');
  });

  canvas.addEventListener('pointerup', (_event) => {
    console.log('Skia canvas pointer up');
  });
}
