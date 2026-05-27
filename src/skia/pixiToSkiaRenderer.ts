import type { SkiaContext } from './skiaTypes';
import { TransformStack } from './transformStack';
import { pixiToSkiaMatrix } from './skiaTypes';
import { drawGraphics } from './drawGraphics';
import { drawSprite } from './drawSprite';
import * as PIXI from 'pixi.js';

export function renderPixiContainerToSkia(skiaContext: SkiaContext, container: PIXI.Container): void {
  const { canvas, canvasKit, surface } = skiaContext;
  const transformStack = new TransformStack();

  canvas.clear(canvasKit.Color4f(1, 1, 1, 1));

  renderContainer(skiaContext, container, transformStack);

  if (surface) {
    surface.flush();
  }
}

function renderContainer(skiaContext: SkiaContext, container: PIXI.Container, transformStack: TransformStack): void {
  const { canvas, canvasKit } = skiaContext;

  const matrix = pixiToSkiaMatrix(container);
  transformStack.push(matrix);

  canvas.save();

  const currentMatrix = transformStack.getCurrent();
  const skMatrix = canvasKit.Matrix.identity();
  skMatrix[0] = currentMatrix.a;
  skMatrix[1] = currentMatrix.c;
  skMatrix[2] = currentMatrix.tx;
  skMatrix[3] = currentMatrix.b;
  skMatrix[4] = currentMatrix.d;
  skMatrix[5] = currentMatrix.ty;
  skMatrix[6] = 0;
  skMatrix[7] = 0;
  skMatrix[8] = 1;
  canvas.concat(skMatrix);

  for (const child of container.children) {
    if (child instanceof PIXI.Graphics) {
      drawGraphics(skiaContext, child);
    } else if (child instanceof PIXI.Sprite) {
      drawSprite(skiaContext, child);
    } else if (child instanceof PIXI.Container) {
      renderContainer(skiaContext, child, transformStack);
    }
  }

  canvas.restore();
}
