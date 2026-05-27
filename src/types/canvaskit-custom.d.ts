declare module '/canvaskit.js' {
  interface CanvasKit {
    MakeCanvasSurface(canvas: HTMLCanvasElement): any;
    MakePDFDocument(): any;
    PDFDocument: any;
  }

  interface CanvasKitInitOptions {
    locateFile: (file: string) => string;
  }

  function CanvasKitInit(options?: CanvasKitInitOptions): Promise<CanvasKit>;
  export default CanvasKitInit;
}
