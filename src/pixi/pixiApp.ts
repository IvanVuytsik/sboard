import * as PIXI from 'pixi.js';

export async function initPixiApp(canvasId: string, config: any) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Canvas with id ${canvasId} not found`);
  }

  const app = new PIXI.Application({
    width: config.canvas.width,
    height: config.canvas.height,
    backgroundColor: config.pixi.backgroundColor,
    antialias: config.pixi.antialias,
    backgroundAlpha: 1,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  if (!canvas.parentElement) {
    document.body.appendChild(app.view as any);
  } else {
    canvas.replaceWith(app.view as any);
  }

  console.log('Pixi application initialized');
  return app;
}
