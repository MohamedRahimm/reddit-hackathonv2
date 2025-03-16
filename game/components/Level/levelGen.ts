import Matter from 'matter-js';

export var engine = Matter.Engine.create();
export var World = Matter.World;
export var Bodies = Matter.Bodies;
export const TILE_SIZE = 64;

// Tile types
export enum Tiles {
  Door = 'Door',
  Exit = 'Exit',
  Blank = 'Blank',
  Trap = 'Trap',
  Floor = 'Floor',
}

// Level layout
export const levelData = [
  [
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
  ],
  [
    Tiles.Floor,
    Tiles.Blank,
    Tiles.Door,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Floor,
  ],
  [
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Blank,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
  ],
  [
    Tiles.Floor,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Floor,
  ],
  [
    Tiles.Floor,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Blank,
    Tiles.Floor,
  ],
  [
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
    Tiles.Floor,
  ],
];

const levelOffsetPx = TILE_SIZE / 2;
function createOuterWalls() {
  console.log('Creating walls');
  let levelWidthPx = levelData[0].length * TILE_SIZE;
  let levelHeightPx = levelData.length * TILE_SIZE;
  // console.log("Level: x: " + levelWidthPx)
  // console.log("Level: y: " + levelHeightPx)

  const params = {
    friction: 0, // No friction
    frictionAir: 0, // No air friction
    frictionStatic: 0, // No static friction
    isStatic: true, // Non-movable object
    label: 'Floor',
    collisionFilter: {},
  };
  const roof = Matter.Bodies.rectangle(
    levelWidthPx / 2,
    levelOffsetPx,
    levelWidthPx,
    TILE_SIZE,
    params
  );
  const leftWall = Matter.Bodies.rectangle(
    levelOffsetPx,
    levelHeightPx / 2,
    TILE_SIZE,
    levelHeightPx - 2 * TILE_SIZE,
    params
  );
  const rightWall = Matter.Bodies.rectangle(
    levelWidthPx - levelOffsetPx,
    levelHeightPx / 2,
    TILE_SIZE,
    levelHeightPx - 2 * TILE_SIZE,
    params
  );
  const floor = Matter.Bodies.rectangle(
    levelWidthPx / 2,
    levelHeightPx - levelOffsetPx,
    levelWidthPx,
    TILE_SIZE,
    params
  );
  console.log(roof.vertices);
  console.log(roof.position);

  World.add(engine.world, [roof, leftWall, rightWall, floor]);
}

createOuterWalls();

export function genInnerObjs() {
  const idk = [];

  // Loop through the inner part of the levelData, excluding borders
  for (let row = 1; row < levelData.length - 1; row++) {
    let xStart = null;
    let yPos = row * TILE_SIZE + TILE_SIZE / 2;

    for (let col = 1; col < levelData[row].length - 1; col++) {
      if (levelData[row][col] === Tiles.Door) {
        World.add(
          engine.world,
          Bodies.rectangle(
            col * TILE_SIZE + TILE_SIZE / 2,
            row * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE,
            TILE_SIZE,
            {
              isStatic: true,
              label: 'door',
              collisionFilter: {
                category: 0x0002,
                mask: 0x0004,
              },
            }
          )
        );
        continue;
      } else if (levelData[row][col] !== Tiles.Blank) {
        if (xStart === null) {
          // Start of consecutive non-blank tiles
          xStart = col * TILE_SIZE;
        }
      } else if (xStart !== null) {
        // End of a consecutive non-blank sequence, so create a rectangle
        let xEnd = col * TILE_SIZE;
        let width = xEnd - xStart;

        idk.push(
          Bodies.rectangle(xStart + width / 2, yPos, width, TILE_SIZE, {
            isStatic: true,
          })
        );
        // Reset xStart for the next sequence
        xStart = null;
      }
    }

    // Handle case where the row ends with consecutive non-blank tiles
    if (xStart !== null) {
      let xEnd = (levelData[row].length - 2) * TILE_SIZE + TILE_SIZE;
      let width = xEnd - xStart;

      idk.push(
        Bodies.rectangle(xStart + width / 2, yPos, width, TILE_SIZE, {
          isStatic: true,
        })
      );
    }
  }
  console.log(idk);
  return idk;
}

World.add(engine.world, genInnerObjs());
