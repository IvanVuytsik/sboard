import * as PIXI from 'pixi.js-legacy';

export function setupPixiPointerEvents(pixiApp: any, scene: PIXI.Container) {
  pixiApp.stage.eventMode = 'static';
  pixiApp.stage.hitArea = pixiApp.screen;

  setupContainerPointerEvents(scene);
}

export function setupGraphicsPointerEvents(graphics: PIXI.Graphics) {
  graphics.eventMode = 'static';
  graphics.cursor = 'pointer';

  graphics.on('pointerdown', () => {
    console.log('Pixi pointer down on:', graphics.name || 'unnamed');
  });
  graphics.on('pointerup', () => {
    console.log('Pixi pointer up on:', graphics.name || 'unnamed');
  });
}

export function setupSpritePointerEvents(sprite: PIXI.Sprite) {
  sprite.eventMode = 'static';
  sprite.cursor = 'pointer';

  sprite.on('pointerdown', () => {
    console.log('Pixi pointer down on:', sprite.name || 'unnamed');
  });
  sprite.on('pointerup', () => {
    console.log('Pixi pointer up on:', sprite.name || 'unnamed');
  });
}

function setupContainerPointerEvents(container: PIXI.Container) {
  container.eventMode = 'static';

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
