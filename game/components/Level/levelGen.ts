import Matter from 'matter-js';

export var engine = Matter.Engine.create();
export var World = Matter.World
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

const levelOffsetPx = TILE_SIZE/2
function createOuterWalls () {
  console.log("Creating walls")
  let levelWidthPx = levelData[0].length * TILE_SIZE
  let levelHeightPx = levelData.length * TILE_SIZE
  // console.log("Level: x: " + levelWidthPx)
  // console.log("Level: y: " + levelHeightPx)

  const params = {
    friction: 0, // No friction
    frictionAir: 0, // No air friction
    frictionStatic: 0, // No static friction
    isStatic: true, // Non-movable object
    label: "Floor",
    collisionFilter: {},
  }
  const roof = Matter.Bodies.rectangle(levelWidthPx/2, levelOffsetPx, levelWidthPx, TILE_SIZE, params);
  const leftWall = Matter.Bodies.rectangle(levelOffsetPx, levelHeightPx/2, TILE_SIZE, levelHeightPx - (2*TILE_SIZE), params);
  const rightWall = Matter.Bodies.rectangle(levelWidthPx-levelOffsetPx, levelHeightPx/2, TILE_SIZE, levelHeightPx - (2*TILE_SIZE), params);
  const floor = Matter.Bodies.rectangle(levelWidthPx/2, (levelHeightPx-levelOffsetPx), levelWidthPx, TILE_SIZE, params);
  console.log(roof.vertices)
  console.log(roof.position)

  World.add(engine.world, [roof, leftWall, rightWall, floor]);
}

createOuterWalls()