import * as PIXI from 'pixi.js';

export function setupPixiPointerEvents(pixiApp: any, scene: PIXI.Container) {
  pixiApp.stage.eventMode = 'static';
  pixiApp.stage.hitArea = pixiApp.screen;

  setupContainerPointerEvents(scene);
}

function setupContainerPointerEvents(container: PIXI.Container) {
  container.eventMode = 'static';

  container.on('pointerdown', onPointerDown);
  container.on('pointerup', onPointerUp);
  container.on('pointerupoutside', onPointerUp);

  for (const child of container.children) {
    if (child instanceof PIXI.Container) {
      setupContainerPointerEvents(child);
    } else if (child instanceof PIXI.Graphics) {
      setupGraphicsPointerEvents(child);
    } else if (child instanceof PIXI.Sprite) {
      setupSpritePointerEvents(child);
    }
  }
}

function setupGraphicsPointerEvents(graphics: PIXI.Graphics) {
  graphics.eventMode = 'static';
  graphics.cursor = 'pointer';

  graphics.on('pointerdown', onPointerDown);
  graphics.on('pointerup', onPointerUp);
  graphics.on('pointerupoutside', onPointerUp);
}

function setupSpritePointerEvents(sprite: PIXI.Sprite) {
  sprite.eventMode = 'static';
  sprite.cursor = 'pointer';

  sprite.on('pointerdown', onPointerDown);
  sprite.on('pointerup', onPointerUp);
  sprite.on('pointerupoutside', onPointerUp);
}

function onPointerDown(event: any) {
  console.log('Pixi pointer down on:', event.target.name || 'unnamed');
  if (event.target instanceof PIXI.Graphics) {
    event.target.alpha = 0.7;
  }
}

function onPointerUp(event: any) {
  console.log('Pixi pointer up on:', event.target.name || 'unnamed');
  if (event.target instanceof PIXI.Graphics) {
    event.target.alpha = 1;
  }
}
