export const config = {
  canvas: {
    width: 400,
    height: 300,
  },
  pixi: {
    backgroundColor: 0xffffff,
    antialias: true,
  },
  skia: {
    wasmPath: '/canvaskit.wasm',
  },
  assets: {
    path: '/assets/',
  },
  features: {
    enablePointerEvents: true,
    enablePDFExport: true,
    enableRandomShapes: true,
  },
};
