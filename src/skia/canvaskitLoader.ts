let ckInstance: any = null;

export async function initSkiaCanvas(canvasId: string, _config: any) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Canvas with id ${canvasId} not found`);
  }

  if (!ckInstance) {
    try {
      console.log('Initializing custom CanvasKit with PDF support...');

      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/canvaskit.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      const CanvasKitInit = (window as any).CanvasKitInit;

      ckInstance = await CanvasKitInit({
        locateFile: (_file: string) => '/canvaskit.wasm'
      });

      console.log('Custom CanvasKit initialized with PDF support');
    } catch (error) {
      console.error('Failed to load custom CanvasKit:', error);
      throw new Error('Custom CanvasKit initialization failed: ' + (error as Error).message);
    }
  }

  const surface = ckInstance.MakeCanvasSurface(canvas);
  if (!surface) {
    throw new Error('Could not make canvas surface');
  }

  const context = {
    canvasKit: ckInstance,
    surface: surface,
    canvas: surface.getCanvas(),
  };

  console.log('Custom Skia CanvasKit initialized');
  return context;
}

export function getCanvasKitInstance() {
  return ckInstance;
}
