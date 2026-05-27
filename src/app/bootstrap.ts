import { config } from './config';
import { initPixiApp, setupPixiPointerEvents } from '../pixi';
import { initSkiaCanvas, renderPixiContainerToSkia } from '../skia';
import { createDemoScene } from '../scene';
import { setupUIControls } from '../ui';
import { setupSkiaPointerEvents } from '../events';
import { exportToPDF } from '../pdf';

let pixiApp: any = null;
let skiaCanvas: any = null;

export async function bootstrap() {
  try {
    console.log('Starting application bootstrap...');

    pixiApp = await initPixiApp('pixi-canvas', config);
    console.log('Pixi application initialized');

    try {
      skiaCanvas = await initSkiaCanvas('skia-canvas', config);
      console.log('Skia CanvasKit initialized successfully');
    } catch (error) {
      console.error('Skia CanvasKit initialization failed, continuing without Skia:', error);
      skiaCanvas = null;
    }

    const scene = createDemoScene();
    console.log('Demo scene created');

    pixiApp.stage.addChild(scene);
    console.log('Scene added to Pixi stage');

    setupPixiPointerEvents(pixiApp, scene);
    console.log('Pixi pointer events set up');

    if (skiaCanvas) {
      setupSkiaPointerEvents(skiaCanvas, 'skia-canvas', scene);
      console.log('Skia pointer events set up');
    }

    if (skiaCanvas) {
      renderSceneToSkia(skiaCanvas, scene);
      console.log('Scene rendered to Skia canvas');
    }

    setupUIControls(pixiApp, skiaCanvas, scene, exportToPDF);
    console.log('UI controls set up');

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    throw error;
  }
}

function renderSceneToSkia(skiaCanvas: any, scene: any) {
  renderPixiContainerToSkia(skiaCanvas, scene);
}

export function getPixiApp() {
  return pixiApp;
}

export function getSkiaCanvas() {
  return skiaCanvas;
}
