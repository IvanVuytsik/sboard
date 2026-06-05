import * as PIXI from 'pixi.js-legacy';
import { addRandomShapeToContainer } from '../scene';
import { renderPixiContainerToSkia } from '../skia';

export function setupUIControls(_pixiApp: any, skiaContext: any, scene: PIXI.Container, exportToPDF: Function) {
  const generateBtn = document.getElementById('generate-shape') as HTMLButtonElement;
  const exportBtn = document.getElementById('export-pdf') as HTMLButtonElement;
  const resetBtn = document.getElementById('reset-scene') as HTMLButtonElement;
  const statusEl = document.getElementById('status') as HTMLDivElement;

  const pdfExportSupported = Boolean(
    skiaContext?.canvasKit?.MakePDFDocument ||
    (skiaContext?.canvasKit?.PDFSetStream && skiaContext?.canvasKit?.PDFMakeDocument)
  );

  if (!pdfExportSupported && exportBtn) {
    exportBtn.disabled = true;
    exportBtn.title = 'PDF export is not supported by the installed CanvasKit build';
  }

  function setStatus(message: string, isError = false) {
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = isError ? 'error' : '';
    }
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      console.log('Generate shape button clicked');
      addRandomShapeToContainer(scene);

      if (skiaContext) {
        renderPixiContainerToSkia(skiaContext, scene);
      }

      setStatus('Random shape added');
    });
  }

  if (exportBtn && !exportBtn.disabled) {
    exportBtn.addEventListener('click', async () => {
      console.log('Export PDF button clicked');
      setStatus('Exporting PDF...');

      try {
        await exportToPDF(skiaContext, scene);
        setStatus('PDF exported successfully');
      } catch (error) {
        console.error('PDF export failed:', error);
        setStatus('PDF export failed: ' + (error as Error).message, true);
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      console.log('Reset scene button clicked');

      while (scene.children.length > 0) {
        scene.removeChildAt(0);
      }

      if (skiaContext) {
        renderPixiContainerToSkia(skiaContext, scene);
      }

      setStatus('Scene reset');
    });
  }

  setStatus(pdfExportSupported ? 'Ready' : 'Ready (Skia unavailable)');
}
