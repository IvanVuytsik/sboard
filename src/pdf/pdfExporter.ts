import type { SkiaContext } from '../skia';
import * as PIXI from 'pixi.js';
import { renderPixiContainerToSkia } from '../skia';

export async function exportToPDF(skiaContext: SkiaContext | null, scene: PIXI.Container): Promise<void> {
  if (!skiaContext) {
    throw new Error('Skia context is not available. PDF export requires Skia CanvasKit to be initialized.');
  }

  const { canvasKit } = skiaContext;

  try {
    console.log('Starting PDF export with custom CanvasKit build...');
    console.log('Scene children count:', scene.children.length);

    if (typeof canvasKit.PDFSetStream !== 'function' ||
        typeof canvasKit.PDFMakeDocument !== 'function' ||
        typeof canvasKit.PDFBeginPage !== 'function' ||
        typeof canvasKit.PDFEndPage !== 'function' ||
        typeof canvasKit.PDFClose !== 'function' ||
        typeof canvasKit.PDFCopyBuffer !== 'function' ||
        typeof canvasKit.PDFGetBufferSize !== 'function') {
      throw new Error('PDF APIs are not available in this CanvasKit build');
    }

    console.log('PDF APIs confirmed available');

    const pdfWidth = 400;
    const pdfHeight = 300;

    const stream = new canvasKit.SkDynamicMemoryWStream();
    console.log('Stream created, type:', typeof stream);

    canvasKit.PDFSetStream(stream);
    console.log('Stream set');

    const docCreated = canvasKit.PDFMakeDocument();
    if (!docCreated) {
      throw new Error('Failed to create PDF document');
    }
    console.log('PDF document created');

    const pageCanvas = canvasKit.PDFBeginPage(pdfWidth, pdfHeight);
    if (!pageCanvas) {
      throw new Error('Failed to begin PDF page');
    }
    console.log('Page canvas obtained:', typeof pageCanvas);

    const pdfContext: SkiaContext = {
      canvasKit: canvasKit,
      surface: null,
      canvas: pageCanvas,
    };

    const bgPaint = new canvasKit.Paint();
    bgPaint.setColor(canvasKit.Color4f(1, 1, 1, 1));
    pageCanvas.drawRect(canvasKit.LTRBRect(0, 0, pdfWidth, pdfHeight), bgPaint);
    bgPaint.delete();

    console.log('Rendering scene to PDF...');
    renderPixiContainerToSkia(pdfContext, scene);

    canvasKit.PDFEndPage();
    console.log('Page finished');

    canvasKit.PDFClose();
    console.log('Document closed');

    const bufferPointer = canvasKit.PDFCopyBuffer();
    const bufferSize = canvasKit.PDFGetBufferSize();

    console.log('PDF buffer pointer:', bufferPointer, 'size:', bufferSize);

    if (bufferPointer === 0 || bufferSize === 0) {
      throw new Error('Failed to copy PDF buffer');
    }

    const pdfBytes = new Uint8Array(bufferSize);
    const wasmMemory = canvasKit.HEAPU8;
    pdfBytes.set(wasmMemory.subarray(bufferPointer, bufferPointer + bufferSize));

    canvasKit.PDFFreeBuffer();

    stream.delete();

    if (!pdfBytes || pdfBytes.length === 0) {
      throw new Error('PDF generation produced no output');
    }

    console.log('PDF bytes length:', pdfBytes.length);

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'scene-export.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('PDF exported successfully!');

  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw error;
  }
}
