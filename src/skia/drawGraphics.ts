import type { SkiaContext } from './skiaTypes';
import * as PIXI from 'pixi.js-legacy';

export function drawGraphics(skiaContext: SkiaContext, graphics: PIXI.Graphics): void {
  const { canvasKit, canvas } = skiaContext;

  const fillPaint = new canvasKit.Paint();
  fillPaint.setAntiAlias(true);
  fillPaint.setStyle(canvasKit.PaintStyle.Fill);

  const strokePaint = new canvasKit.Paint();
  strokePaint.setAntiAlias(true);
  strokePaint.setStyle(canvasKit.PaintStyle.Stroke);
  strokePaint.setStrokeWidth(1);
  strokePaint.setColor(canvasKit.Color4f(0, 0, 0, 1));
  strokePaint.setStrokeCap(canvasKit.StrokeCap.Round);
  strokePaint.setStrokeJoin(canvasKit.StrokeJoin.Round);

  const bounds = graphics.getBounds();

  const geometry = (graphics as any).geometry;
  const geometryData = geometry?.graphicsData;

  if (geometryData && geometryData.length > 0) {
    for (const data of geometryData) {
      const shape = data.shape;
      const fillStyle = data.fillStyle;
      const lineStyle = data.lineStyle;

      if (fillStyle?.visible !== false) {
        const color = fillStyle?.color ?? 0xFFFFFF;
        const alpha = fillStyle?.alpha ?? 1;
        const r = ((color >> 16) & 0xFF) / 255;
        const g = ((color >> 8) & 0xFF) / 255;
        const b = (color & 0xFF) / 255;
        fillPaint.setColor(canvasKit.Color4f(r, g, b, alpha));
        fillPaint.setStyle(canvasKit.PaintStyle.Fill);

        if (shape) {
          drawShape(canvas, canvasKit, shape, graphics, fillPaint);
        }
      }

      if (lineStyle?.visible !== false && lineStyle?.width > 0) {
        const color = lineStyle?.color ?? 0x000000;
        const alpha = lineStyle?.alpha ?? 1;
        const r = ((color >> 16) & 0xFF) / 255;
        const g = ((color >> 8) & 0xFF) / 255;
        const b = (color & 0xFF) / 255;
        const width = (lineStyle?.width ?? 1) * 0.8;
        strokePaint.setColor(canvasKit.Color4f(r, g, b, alpha));
        strokePaint.setStrokeWidth(width);
        strokePaint.setStyle(canvasKit.PaintStyle.Stroke);

        if (shape) {
          drawShape(canvas, canvasKit, shape, graphics, strokePaint);
        }
      }
    }
  } else if (bounds.width > 0 && bounds.height > 0) {
    fillPaint.setColor(canvasKit.Color4f(1, 0, 0, 1));
    canvas.drawRect(
      canvasKit.LTRBRect(bounds.x, bounds.y, bounds.x + bounds.width, bounds.y + bounds.height),
      fillPaint
    );
  }

  fillPaint.delete();
  strokePaint.delete();
}

function drawShape(canvas: any, canvasKit: any, shape: any, graphics: PIXI.Graphics, paint: any): void {
  const gx = graphics.x;
  const gy = graphics.y;
  const gr = graphics.rotation;
  const gscaleX = graphics.scale.x;
  const gscaleY = graphics.scale.y;

  if (shape.type === PIXI.SHAPES.RECT) {
    const sx = shape.x;
    const sy = shape.y;
    const sw = shape.width;
    const sh = shape.height;

    const cos = Math.cos(gr);
    const sin = Math.sin(gr);

    const builder = new canvasKit.PathBuilder();
    const corners = [
      { x: sx, y: sy },
      { x: sx + sw, y: sy },
      { x: sx + sw, y: sy + sh },
      { x: sx, y: sy + sh }
    ];

    const first = corners[0];
    const w0x = gx + (first.x * cos * gscaleX - first.y * sin * gscaleY);
    const w0y = gy + (first.x * sin * gscaleX + first.y * cos * gscaleY);
    builder.moveTo(w0x, w0y);

    for (let i = 1; i < corners.length; i++) {
      const c = corners[i];
      const wx = gx + (c.x * cos * gscaleX - c.y * sin * gscaleY);
      const wy = gy + (c.x * sin * gscaleX + c.y * cos * gscaleY);
      builder.lineTo(wx, wy);
    }
    builder.close();

    const path = builder.detach();
    canvas.drawPath(path, paint);

  } else if (shape.type === PIXI.SHAPES.CIRC) {
    const cx = shape.x;
    const cy = shape.y;
    const r = shape.radius;
    const scaledR = r * Math.max(gscaleX, gscaleY);

    const cos = Math.cos(gr);
    const sin = Math.sin(gr);
    const wcx = gx + (cx * cos * gscaleX - cy * sin * gscaleY);
    const wcy = gy + (cx * sin * gscaleX + cy * cos * gscaleY);

    canvas.drawOval(canvasKit.LTRBRect(wcx - scaledR, wcy - scaledR, wcx + scaledR, wcy + scaledR), paint);

  } else if (shape.type === PIXI.SHAPES.POLY) {
    const points = shape.points;
    if (points && points.length >= 6) {
      const cos = Math.cos(gr);
      const sin = Math.sin(gr);

      const transformed: number[] = [];
      for (let i = 0; i < points.length; i += 2) {
        const px = points[i];
        const py = points[i + 1];
        const wx = gx + (px * cos * gscaleX - py * sin * gscaleY);
        const wy = gy + (px * sin * gscaleX + py * cos * gscaleY);
        transformed.push(wx, wy);
      }

      const builder = new canvasKit.PathBuilder();
      builder.addPolygon(transformed, true);
      const path = builder.detach();
      canvas.drawPath(path, paint);
    }
  }
}
