import type { SkiaContext } from './skiaTypes';
import * as PIXI from 'pixi.js';

export function drawSprite(skiaContext: SkiaContext, sprite: PIXI.Sprite): void {
  const { canvasKit, canvas } = skiaContext;

  const paint = new canvasKit.Paint();
  paint.setAntiAlias(true);

  const image = (sprite.texture?.baseTexture?.resource as any)?.source;
  if (!image) {
    paint.delete();
    return;
  }

  const skImage = canvasKit.MakeImageFromCanvasImageSource(image);
  if (!skImage) {
    paint.delete();
    return;
  }

  const destRect = canvasKit.LTRBRect(sprite.x, sprite.y, sprite.x + sprite.width, sprite.y + sprite.height);

  if (sprite.rotation !== 0) {
    canvas.save();
    canvas.translate(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2);
    canvas.rotate(sprite.rotation);
    canvas.translate(-(sprite.x + sprite.width / 2), -(sprite.y + sprite.height / 2));
    canvas.drawImageRect(skImage, destRect, paint);
    canvas.restore();
  } else {
    canvas.drawImageRect(skImage, destRect, paint);
  }

  skImage.delete();
  paint.delete();
}
