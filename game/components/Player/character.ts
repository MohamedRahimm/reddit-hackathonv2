import { levelData, TILE_SIZE, Tiles } from '../Level/levelGen';
import { Bodies } from '../../main'
import { player_physics } from './characterPhysics';

function findDoorPosition(levelData: Tiles[][]): { x: number; y: number } {
  for (let row = 0; row < levelData.length; row++) {
    for (let col = 0; col < levelData[row].length; col++) {
      if (levelData[row][col] === Tiles.Door) {
        // Return the position of the door (row, col)
        return { x: col, y: row };
      }
    }
  }
  // If no door is found, return a default position
  return { x: 2, y: 2 };
}
const doorPos = findDoorPosition(levelData);
const playerX = doorPos.x * TILE_SIZE + TILE_SIZE / 2;
const playerY = doorPos.y * TILE_SIZE + TILE_SIZE;

interface PlayerParams {
  ground: boolean;
}

export const playerRadius = TILE_SIZE/4;
export const player = Bodies.rectangle(playerX, playerY, playerRadius, playerRadius, {
  label: 'character',
  //   density: 0.001,
  friction: 0,
  frictionStatic: 0,
  frictionAir: 0,
  //   slop: -1,
  restitution: 0,
  inertia: Infinity,
  collisionFilter: {
    category: 0x0001, // Player category
    mask: 0xffff & ~0x0002, // Collides with everything except the door
  },
  render: {
    strokeStyle: 'black',
    fillStyle: 'lightgrey',
  },
  plugin: {
    ground: true,
  } as PlayerParams,
});

// onGround sensor for jumping
export var playerSensor = Bodies.rectangle(0, 0, playerRadius, 5, {
  label: 'Sensor',
  isSensor: true,
  friction: 0,
  frictionStatic: 0,
  frictionAir: 0,
  inertia: Infinity,
  render: {
    visible: false,
  },
});

// ensure player has no friction
player.friction = 0;
player.frictionAir = 0;
player.frictionStatic = 0;
player_physics()