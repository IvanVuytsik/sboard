import * as PIXI from 'pixi.js';

export interface SkiaContext {
  canvasKit: any;
  surface: any;
  canvas: any;
}

export function pixiToSkiaMatrix(displayObject: PIXI.Container) {
  const local = displayObject.localTransform;

  return {
    a: local.a,
    b: local.b,
    c: local.c,
    d: local.d,
    tx: local.tx,
    ty: local.ty,
  };
}

export function skMatrixToFloat32Array(matrix: { a: number; b: number; c: number; d: number; tx: number; ty: number }) {
  return new Float32Array([
    matrix.a,
    matrix.b,
    matrix.c,
    matrix.d,
    matrix.tx,
    matrix.ty,
  ]);
}
