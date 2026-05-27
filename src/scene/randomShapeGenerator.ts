import * as PIXI from 'pixi.js';

export function generateRandomShape(): PIXI.Graphics {
  const graphics = new PIXI.Graphics();

  const shapeType = Math.floor(Math.random() * 3);
  const color = Math.random() * 0xFFFFFF;

  graphics.lineStyle(2, 0x000000);
  graphics.beginFill(color);

  switch (shapeType) {
    case 0:
      const width = 30 + Math.random() * 50;
      const height = 30 + Math.random() * 50;
      graphics.drawRect(-width / 2, -height / 2, width, height);
      break;
    case 1:
      const radius = 15 + Math.random() * 25;
      graphics.drawCircle(0, 0, radius);
      break;
    case 2:
      const size = 30 + Math.random() * 40;
      graphics.moveTo(0, -size / 2);
      graphics.lineTo(size / 2, size / 2);
      graphics.lineTo(-size / 2, size / 2);
      graphics.closePath();
      break;
  }

  graphics.endFill();

  return graphics;
}

export function addRandomShapeToContainer(container: PIXI.Container) {
  const shape = generateRandomShape();

  const padding = 50;
  shape.x = padding + Math.random() * (400 - padding * 2);
  shape.y = padding + Math.random() * (300 - padding * 2);

  shape.rotation = Math.random() * Math.PI * 2;
  shape.scale.set(0.5 + Math.random() * 0.5);
  container.addChild(shape);
}
