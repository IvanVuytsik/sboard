import * as PIXI from 'pixi.js-legacy';

interface HitObject {
  graphics?: PIXI.Graphics;
  sprite?: PIXI.Sprite;
}

export function setupSkiaPointerEvents(_skiaContext: any, canvasId: string, scene: PIXI.Container) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  canvas.style.pointerEvents = 'auto';

  const pressedObjects = new Set<PIXI.Graphics | PIXI.Sprite>();

  function getHitObject(localX: number, localY: number, container: PIXI.Container): HitObject | null {
    for (let i = container.children.length - 1; i >= 0; i--) {
      const child = container.children[i];
      if (child instanceof PIXI.Graphics) {
        const bounds = child.getBounds();
        if (localX >= bounds.x && localX <= bounds.x + bounds.width &&
            localY >= bounds.y && localY <= bounds.y + bounds.height) {
          return { graphics: child };
        }
      } else if (child instanceof PIXI.Sprite) {
        const bounds = child.getBounds();
        if (localX >= bounds.x && localX <= bounds.x + bounds.width &&
            localY >= bounds.y && localY <= bounds.y + bounds.height) {
          return { sprite: child };
        }
      } else if (child instanceof PIXI.Container) {
        const result = getHitObject(localX, localY, child);
        if (result) return result;
      }
    }
    return null;
  }

  function handlePointerDown(target: PIXI.Graphics | PIXI.Sprite) {
    console.log('Skia canvas pointer down on:', target.name || 'unnamed');
    pressedObjects.add(target);
  }

  function handlePointerUp(target: PIXI.Graphics | PIXI.Sprite) {
    console.log('Skia canvas pointer up on:', target.name || 'unnamed');
    pressedObjects.delete(target);
  }

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = getHitObject(x, y, scene);
    if (hit?.graphics) {
      handlePointerDown(hit.graphics);
    } else if (hit?.sprite) {
      handlePointerDown(hit.sprite);
    }
  });

  canvas.addEventListener('pointerup', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = getHitObject(x, y, scene);
    if (hit?.graphics && pressedObjects.has(hit.graphics)) {
      handlePointerUp(hit.graphics);
    } else if (hit?.sprite && pressedObjects.has(hit.sprite)) {
      handlePointerUp(hit.sprite);
    }
  });
}
